// mern-project-server/src/constants/permissions.js

// REMOVE THE FOLLOWING LINE (it should NOT be here in a backend file)
// import { useSelector } from "react-redux";

const permissions = {
    admin: [
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'link:create',
        'link:read',
        'link:update',
        'link:delete',
        'payment:create',
    ],
    developer: [
        'link:read',
        'payment:create',
        'link:create',
        'link:delete',
    ],
    viewer: [
        'link:read',
        'user:read',
        'payment:create',
        'link:create',
        'link:delete',
    ]
};

module.exports = {permissions};