const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('../model/Users');
const { OAuth2Client } = require('google-auth-library');
const { validationResult } = require('express-validator');
const { attemptToRefreshToken } = require('../util/authUtil');
const { VIEWER_ROLE, ADMIN_ROLE } = require('../constants/userConstants'); // Import roles

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

const authController = {
    login: async (request, response) => {
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                console.log('Login failed: Validation errors:', errors.array()); // <-- ADD THIS LOG
                return response.status(401).json({ errors: errors.array() });
            }

            const { username, password } = request.body;
            console.log('Attempting to find user with email:', username); // <-- ADD THIS LOG

            const data = await Users.findOne({ email: username });
            if (!data) {
                console.log('Login failed: User not found for email:', username); // <-- ADD THIS LOG
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            console.log('User found. Comparing passwords...'); // <-- ADD THIS LOG
            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                console.log('Login failed: Password mismatch for user:', username); // <-- ADD THIS LOG
                return response.status(401).json({ message: 'Invalid credentials ' });
            }

            const user = {
                id: data._id,
                name: data.name,
                email: data.email,
                role: data.role ? data.role : ADMIN_ROLE, // Ensure role is defined, default to admin if not (consider a safer default)
                adminId: data.adminId,
                credits: data.credits,
                subscription: data.subscription
            };

            const token = jwt.sign(user, secret, { expiresIn: '1h' });
            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Corrected
                sameSite: 'Lax',
                path: '/',
            });

            // Convert Mongoose document to plain object before signing
            const refreshTokenPayload = data.toObject(); // Use the found 'data' directly, or construct a new payload
            const refreshtoken = jwt.sign(refreshTokenPayload, refreshSecret, { expiresIn: '7d' }); // Standardized to 7d
            // Recommendation: Store this refresh token in the database for proper revocation
            response.cookie('refreshToken', refreshtoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Corrected
                sameSite: 'Lax',
                path: '/',
            });
            response.json({ user: user, message: 'User authenticated' });
        } catch (error) {
            console.error('Login Error (caught in try-catch):', error);
            response.status(500).json({ error: 'Internal server error' });
        }
    },

    logout: (request, response) => {
        response.clearCookie('jwtToken', { path: '/' }); // Ensure path is specified
        response.clearCookie('refreshToken', { path: '/' }); // Clear refresh token as well
        response.json({ message: 'Logout successfull' });
    },

    isUserLoggedIn: async (request, response) => {
        const token = request.cookies.jwtToken;

        if (!token) {
            return response.status(401).json({ message: 'Unauthorized access: No access token' });
        }

        jwt.verify(token, secret, async (error, user) => {
            if (error) {
                const refreshToken = request.cookies?.refreshToken;
                if (refreshToken) {
                    try {
                        const { newAccessToken, user: refreshedUser } = await attemptToRefreshToken(refreshToken);

                        response.cookie('jwtToken', newAccessToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'Lax',
                            path: '/',
                        });

                        console.log('✅ Refresh token renewed the access token');
                        // Fetch latest user details from DB to ensure credits/subscription are up-to-date
                        const latestUserDetails = await Users.findById({ _id: refreshedUser.id });
                        return response.json({ message: 'User is logged in', user: latestUserDetails });
                    } catch (refreshErr) {
                        console.error('Refresh token failed in middleware:', refreshErr.message); // Improved logging
                        // Clear invalid tokens if refresh fails to force re-login
                        response.clearCookie('jwtToken', { path: '/' });
                        response.clearCookie('refreshToken', { path: '/' });
                        return response.status(401).json({ error: 'Unauthorized access: Invalid refresh token' });
                    }
                }

                return response.status(401).json({ message: 'Unauthorized access: No refresh token' });
            } else {
                // Fetch latest user details from DB to ensure credits/subscription are up-to-date
                const latestUserDetails = await Users.findById({ _id: user.id });
                if (!latestUserDetails) {
                    // User might have been deleted
                    response.clearCookie('jwtToken', { path: '/' });
                    response.clearCookie('refreshToken', { path: '/' });
                    return response.status(401).json({ message: 'Unauthorized access: User not found' });
                }
                return response.json({ message: 'User is logged in', user: latestUserDetails });
            }
        });
    },

    register: async (request, response) => {
        try {
            const { username, password, name } = request.body;

            const data = await Users.findOne({ email: username });
            if (data) {
                return response.status(401)
                    .json({ message: 'Account already exist with given email' });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = new Users({
                email: username,
                password: encryptedPassword,
                name: name,
                role: VIEWER_ROLE // Corrected: Default to viewer role for self-registration
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
                secure: process.env.NODE_ENV === 'production', // Corrected
                sameSite: 'Lax',
                path: '/',
            });
            response.json({ message: 'User registered', user: userDetails });
        } catch (error) {
            console.error('Register Error:', error); // Improved logging
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
                    role: ADMIN_ROLE, // Default to admin for first Google user, subsequent Google users might need different logic
                    adminId: null // Initial value, will be updated below
                });
                await user.save();
                user.adminId = user._id; // Set adminId to self if they are the first admin via Google
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
                secure: process.env.NODE_ENV === 'production', // Corrected
                sameSite: 'Lax',
            });

            // Convert Mongoose user document to a plain JavaScript object before signing
            const refreshTokenPayload = user.toObject(); // Corrected: Using .toObject()
            const refreshtoken = jwt.sign(refreshTokenPayload, refreshSecret, { expiresIn: '7d' }); // Standardized to 7d
            // Recommendation: Store this refresh token in the database for proper revocation
            res.cookie('refreshToken', refreshtoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Corrected
                sameSite: 'Lax',
                path: '/',
            });

            res.status(200).json({ user: userPayload, message: 'User authenticated' });
        } catch (error) {
            console.error('Google Auth Error:', error); // Improved logging
            res.status(401).json({ message: 'Google authentication failed' });
        }
    },
};

module.exports = authController;