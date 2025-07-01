const permissions = require("../constants/permissions");

const authorize = (requirePermission) => {
    return (request, response, next) => {
        //Authmiddleware will run before this middleware
        const user = request.user;

        if(!user) {
            return response.status(401).json({
                message: 'Unauthorized access'
            });
        }
        const userPermission = permissions[user.role] || [];
        if(!userPermission.includes(requirePermission)) {
            return response.status(403).json({
                message: 'Forbidden: Insufficient Permission '
            })
        }

        next();
    };
};

module.exports = authorize;