import { Outlet, Navigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/features/auth/AuthContext";
import PostDialog2 from "@/features/posts/PostDialog2";
import { ToastContainer } from "react-toastify";

function ProtectedRoute() {
    const { auth } = useAuthContext()!;
    const [searchParams] = useSearchParams();

    if (!auth?.status || auth.status === "loading")
        return <div>loading...</div>;

    const postUuid = searchParams.get("post");

    return auth.status === "authenticated" ? (
        <>
            {postUuid && <PostDialog2 postUuid={postUuid} />}
            <ToastContainer position="bottom-right" stacked />
            <Outlet />
        </>
    ) : (
        <Navigate to="/signin" replace />
    );
}

export default ProtectedRoute;
