const jwt = require('jsonwebtoken');
const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const secret = process.env.JWT_SECRET;
const Users = require('../model/Users');
const { VIEWER_ROLE } = require('../constants/userConstants'); // Import roles

const attemptToRefreshToken = async (refreshToken) => {
    try{
        const decoded = await jwt.verify(refreshToken, refreshSecret);

        //Fetch the latest user data from DB as across 7 days of
        //refreshToken lifecycle, user details like credits, subscripttions
        //can change
        const data = await Users.findById({ _id: decoded.id});
        if (!data) {
            throw new Error('User not found during refresh token attempt');
        }

        const user = {
            id: data._id,
            username: data.email,
            name: data.name,
            role: data.role ? data.role : VIEWER_ROLE, // Corrected: Default to VIEWER_ROLE
            credits: data.credits,
            subscription: data.subscription
        };

        const newAccessToken = jwt.sign(user, secret, {expiresIn: '1h'});

        return {newAccessToken, user };
    } catch(error) {
        console.error('Error during token refresh:', error); // Improved logging
        throw error;
    }
};

module.exports = { attemptToRefreshToken };