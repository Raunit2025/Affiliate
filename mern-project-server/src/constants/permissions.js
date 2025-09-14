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
