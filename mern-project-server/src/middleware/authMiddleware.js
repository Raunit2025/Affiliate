const jwt = require('jsonwebtoken');
const { attemptToRefreshToken } = require('../util/authUtil');

const authMiddleware = {
  protect: async (request, response, next) => {
    try {
      const token = request.cookies?.jwtToken;

      if (!token) {
        return response.status(401).json({ error: 'Unauthorized access: No access token' });
      }

      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        request.user = user;
        return next();
      } catch (error) {
        const refreshToken = request.cookies?.refreshToken;
        if (refreshToken) {
          try {
            const { newAccessToken, user } = await attemptToRefreshToken(refreshToken);

            response.cookie('jwtToken', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production', 
              sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
              path: '/'
            });

            request.user = user;
            return next();
          } catch (refreshErr) {
            console.error('Refresh token failed in middleware:', refreshErr.message); 
            response.clearCookie('jwtToken', { path: '/' });
            response.clearCookie('refreshToken', { path: '/' });
            return response.status(401).json({ error: 'Unauthorized access: Invalid refresh token' });
          }
        } else {
          return response.status(401).json({ error: 'Unauthorized access: No refresh token' });
        }
      }
    } catch (error) {
      console.error('Auth middleware error:', error); 
      response.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authMiddleware;