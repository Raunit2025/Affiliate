// mern_project_1/src/rbac/userPermissions.jsx
import { useSelector } from "react-redux";

export const ROLE_PERMISSIONS = {
    admin: {
        canViewUser: true,
        canCreateUser: true,
        canDeleteUser: true,
        canEditUser: true,
        canViewLink: true,
        canCreateLink: true, // Should be true
        canDeleteLink: true,
        canEditLink: true,
    },
    developer: {
        canViewUser: false,
        canCreateUser: false,
        canDeleteUser: false,
        canEditUser: false,
        canViewLink: true,
        canCreateLink: true, // THIS MUST BE TRUE
        canDeleteLink: true,
        canEditLink: true,
    },
    viewer: {
        canViewUser: true,
        canCreateUser: false,
        canDeleteUser: false,
        canEditUser: false,
        canViewLink: true,
        canCreateLink: true, // THIS MUST BE TRUE
        canDeleteLink: true,
        canEditLink: true,
    },
};

export const usePermission = () => {
    const user = useSelector((state) => state.userDetails);
    return ROLE_PERMISSIONS[user?.role] || {};
};