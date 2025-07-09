import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Check if the logged-in user's role is part of allowed roles.
// If yes, render children; otherwise, redirect to unauthorized page.
function ProtectedRoute({ roles, children }) {
    const user = useSelector((state) => state.userDetails);
    return roles.includes(user?.role)
        ? children
        : <Navigate to="/unauthorized-access" />;
}

export default ProtectedRoute;
