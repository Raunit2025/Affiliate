const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const {attemptToRefreshToken}   = require('../util/authUtil');

// https://www.uuidgenerator.net/
const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

const authController = {
    login: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                return response.status(401).json({ errors: errors.array() });
            }

            // The body contains username and password because of the express.json()
            // middleware configured in the server.js
            const { username, password } = request.body;

            // Call Database to fetch user by the email
            const data = await Users.findOne({ email: username });
            if (!data) {
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const user = {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role ? data.role : 'admin',
                adminId: data.adminId,
                credits: data.credits,
                subscription: data.subscription
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });

            const refreshtoken = jwt.sign(user, refreshSecret, { expiresIn: '1h' });
            //Store it in the database if you want! Storing in DB will
            // make refresh tokens more secure.
            response.cookie('refreshToken', refreshtoken, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({ user: user, message: 'User authenticated' });
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: 'Internal server error' });
        }
    },

    logout: (request, response) => {
        response.clearCookie('jwtToken');
        response.json({ message: 'Logout successfull' });
    },

    isUserLoggedIn: async (request, response) => {
        const token = request.cookies.jwtToken;

        if (!token) {
            return response.status(401).json({ message: 'Unauthorized access' });
        }

        jwt.verify(token, secret, async (error, user) => {
            if (error) {
                const refreshToken = request.cookies?.refreshToken;
                if(refreshToken) {
                    const {newAccessToken , user } = await attemptToRefreshToken(refreshToken);
                    response.cookie('jwtToken', newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        domain: 'localhost',
                        path: '/'
                    });

                    console.log('Refresh token renewed the access token');
                    return response.json({ messsage: 'User is logged in', user: user})
                }
                return response.status(401).json({ message: 'Unauthorized access' });
            } else {
                const latestUserDetails = await Users.findById({ _id: user.id });
                response.json({ message: 'User is logged in', user: latestUserDetails });
            }
        });
    },

    register: async (request, response) => {
        try {
            // Extract attributes from the request body
            const { username, password, name } = request.body;

            // Firstly check if user already exist with the given email
            const data = await Users.findOne({ email: username });
            if (data) {
                return response.status(401)
                    .json({ message: 'Account already exist with given email' });
            }

            // Encrypt the password before saving the record to the database
            const encryptedPassword = await bcrypt.hash(password, 10);

            // Create mongoose model object and set the record values
            const user = new Users({
                email: username,
                password: encryptedPassword,
                name: name,
                role: 'admin'
            });
            await user.save();
            const userDetails = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits
            };
            const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });
            response.json({ message: 'User registered', user: userDetails });
        } catch (error) {
            console.log(error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    },

    googleAuth: async (req, res) => {
        try {
            const { credential } = req.body;
            if (!credential) {
                return res.status(400).json({ message: 'Missing Google credential' });
            }

            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { email, name, sub: googleId } = payload;

            let user = await Users.findOne({ email });
            if (!user) {
                user = new Users({
                    email,
                    name,
                    googleId,
                    isGoogleUser: true,
                    role: 'admin'
                });
                await user.save();
            }

            const userPayload = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                credits: user.credits,
            };

            const token = jwt.sign(userPayload, secret, { expiresIn: '1h' });
            res.cookie('jwtToken', token, {
                httpOnly: true,
                secure: false, // change to true in production with HTTPS
                sameSite: 'Lax',
            });

            const refreshtoken = jwt.sign(user, refreshSecret, { expiresIn: '7d' });
            //Store it in the database if you want! Storing in DB will
            // make refresh tokens more secure.
            response.cookie('refreshToken', refreshtoken, {
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path: '/'
            });

            res.status(200).json({ user: userPayload, message: 'User authenticated' });
        } catch (error) {
            console.error('Google Auth Error:', error);
            res.status(401).json({ message: 'Google authentication failed' });
        }
    },

    

};

module.exports = authController;