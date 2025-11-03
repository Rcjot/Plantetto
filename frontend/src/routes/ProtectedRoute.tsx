import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/AuthContext";

function ProtectedRoute() {
    const { auth } = useAuthContext()!;

    if (!auth?.status || auth.status === "loading")
        return <div>loading...</div>;

    return auth.status === "authenticated" ? (
        <Outlet />
    ) : (
        <Navigate to="/signin" replace />
    );
}

export default ProtectedRoute;