import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/AuthContext";

function PublicRoute() {
    const { auth } = useAuthContext()!;

    if (!auth?.status || auth.status === "loading")
        return <div>loading...</div>;

    return auth.status === "unauthenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="/home" replace />
    );
}
export default PublicRoute;