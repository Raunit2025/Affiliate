const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const { OAuth2Client } = require('google-auth-library');

const secret = "3f635806-4c5c-4d27-8f90-a0873f217694";

const authController = {
  login: async (request, response) => {
    try {
      const { username, password } = request.body;

      // Hardcoded admin login
      if (username === 'admin' && password === '123456') {
        const user = {
          id: 'admin-id',
          name: 'Admin',
          email: 'admin'
        };

        const token = jwt.sign(user, secret, { expiresIn: '1h' });

        response.cookie('jwtToken', token, {
          httpOnly: true,
          secure: false, // Use `true` in production with HTTPS
          sameSite: 'Strict',
          domain: 'localhost',
          path: '/'
        });

        return response.json({ user, message: 'Admin authenticated' });
      }

      // Normal DB login
      const data = await Users.findOne({ email: username });
      if (!data) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, data.password);
      if (!isMatch) {
        return response.status(401).json({ message: 'Invalid credentials' });
      }

      const user = {
        id: data._id,
        name: data.name,
        email: data.email
      };

      const token = jwt.sign(user, secret, { expiresIn: '1h' });

      response.cookie('jwtToken', token, {
        httpOnly: true,
        secure: false, // Use `true` in production with HTTPS
        sameSite: 'Strict',
        domain: 'localhost',
        path: '/'
      });

      response.json({ user, message: 'User authenticated' });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: (request, response) => {
    response.clearCookie('jwtToken', {
      domain: 'localhost',
      path: '/'
    });
    response.json({ message: "Logout successful" });
  },

  isUserLoggedIn: (request, response) => {
    const token = request.cookies.jwtToken;

    if (!token) {
      return response.status(401).json({ message: 'Unauthorized access' });
    }

    jwt.verify(token, secret, (error, user) => {
      if (error) {
        return response.status(401).json({ message: 'Unauthorized access' });
      }
      response.json({ message: 'User logged in', user });
    });
  },

  register: async (request, response) => {
    try {
      const { username, password, name } = request.body;

      const existingUser = await Users.findOne({ email: username });
      if (existingUser) {
        return response.status(401).json({ message: 'Account already exists with given email' });
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new Users({
        email: username,
        password: encryptedPassword,
        name
      });

      await newUser.save();
      response.status(200).json({ message: 'User registered' });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Internal server error' });
    }
  },

  googleAuth: async (request, response) => {
    try {
      const { idToken } = request.body;

      if (!idToken) {
        return response.status(401).json({ message: 'Invalid request' });
      }

      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { sub: googleId, name, email } = payload;

      let data = await Users.findOne({ email });

      if (!data) {
        data = new Users({
          email,
          name,
          isGoogleUser: true,
          googleId
        });
        await data.save();
      }

      const user = {
        id: data._id,
        username: email,
        name
      };

      const token = jwt.sign(user, secret, { expiresIn: '1h' });

      response.cookie('jwtToken', token, {
        httpOnly: true,
        secure: false, // Use `true` in production with HTTPS
        sameSite: 'Strict',
        domain: 'localhost',
        path: '/'
      });

      response.json({ user, message: 'User authenticated' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = authController;
