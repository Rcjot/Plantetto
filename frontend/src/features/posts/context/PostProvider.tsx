import { useMemo } from "react";
import { PostContext } from "./PostContext";
import usePost from "./usePost";
import type { PostType } from "../postTypes";
import PostCard from "../PostCard";

function PostCardProvider({
    passedPost,
    origin = "/home",
}: {
    passedPost: PostType;
    origin?: string;
}) {
    const { post, updatePost, openEdit, setOpenEditCallback } =
        usePost(passedPost);

    const contextValue = useMemo(
        () => ({
            post,
            updatePost,
            openEdit,
            setOpenEditCallback,
            origin, // Add this
        }),
        [post, updatePost, openEdit, setOpenEditCallback, origin]
    );

    return (
        <PostContext.Provider value={contextValue}>
            <PostCard />
        </PostContext.Provider>
    );
}

export default PostCardProvider;