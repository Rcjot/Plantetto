import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute() {
    const authStatus = "authenticated";

    return authStatus === "authenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="login" replace />
    );
}

export default ProtectedRoute;
