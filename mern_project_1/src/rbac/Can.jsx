import { useSelector } from "react-redux";
import { ROLE_PERMISSIONS } from "./userPermissions";

// Conditionally render children based on user permission
function Can({ permission, children }) {
    const user = useSelector((state) => state.userDetails);
    const permissions = ROLE_PERMISSIONS[user?.role] || {};

    return permissions[permission] ? children : null;
}

export default Can;
