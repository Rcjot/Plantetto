import { Outlet, Navigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "@/features/auth/AuthContext";
import { useEffect } from "react";
import PostDialog2 from "@/features/posts/PostDialog2";

function ProtectedRoute() {
    const { auth } = useAuthContext()!;
    const [searchParams] = useSearchParams();

    useEffect(() => {
        console.log(searchParams.get("post"));
    }, [searchParams]);

    if (!auth?.status || auth.status === "loading")
        return <div>loading...</div>;

    const postUuid = searchParams.get("post");

    return auth.status === "authenticated" ? (
        <>
            {postUuid && <PostDialog2 postUuid={postUuid} />}
            <Outlet />
        </>
    ) : (
        <Navigate to="/signin" replace />
    );
}

export default ProtectedRoute;
