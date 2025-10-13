import { Outlet, Navigate } from "react-router-dom";

function PublicRoute() {
    const authStatus = "unauthenticated";

    return authStatus === "unauthenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="/home" replace />
    );
}
export default PublicRoute;
