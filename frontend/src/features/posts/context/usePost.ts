import { useCallback, useState } from "react";
import type { PostType } from "../postTypes";

function usePost(passedPost: PostType) {
    const [post, setPost] = useState<PostType>(passedPost);
    const [openEdit, setOpenEdit] = useState(false);

    const updateCaption = useCallback((newCaption: string) => {
        setPost((prev) => ({ ...prev, caption: newCaption }));
    }, []);

    const setOpenEditCallback = useCallback((open: boolean) => {
        setOpenEdit(open);
    }, []);

    return {
        updateCaption,
        post,
        openEdit,
        setOpenEditCallback,
    };
}

export default usePost;
