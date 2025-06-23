const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const secret = "3f635806-4c5c-4d27-8f90-a0873f217694";

const authController = {
    login: async (request, response) => {
        try {
            const { username, password } = request.body;

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
                secure: true,
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
    }
};

module.exports = authController;
