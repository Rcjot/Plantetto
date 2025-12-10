import { Outlet, Navigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/AuthContext";
import { ToastContainer } from "react-toastify";

function PublicRoute() {
    const { auth } = useAuthContext()!;

    if (!auth?.status || auth.status === "loading")
        return <div>loading...</div>;

    return auth.status === "unauthenticated" ? (
        <>
            <ToastContainer position="bottom-right" stacked />
            <Outlet />
        </>
    ) : (
        <Navigate to="/home" replace />
    );
}
export default PublicRoute;
