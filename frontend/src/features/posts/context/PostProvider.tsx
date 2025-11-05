import { useMemo } from "react";
import { PostContext } from "./PostContext";
import usePost from "./usePost";
import type { PostType } from "../postTypes";
import PostCard from "../PostCard";

function PostCardProvider({ passedPost }: { passedPost: PostType }) {
    const { post, updateCaption, openEdit, setOpenEditCallback } =
        usePost(passedPost);

    const contextValue = useMemo(
        () => ({
            post,
            updateCaption,
            openEdit,
            setOpenEditCallback,
        }),
        [post, updateCaption, openEdit, setOpenEditCallback]
    );

    return (
        <PostContext.Provider value={contextValue}>
            <PostCard />
        </PostContext.Provider>
    );
}

export default PostCardProvider;
