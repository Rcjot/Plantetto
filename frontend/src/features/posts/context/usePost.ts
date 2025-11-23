import { useCallback, useState } from "react";
import type { PostType } from "../postTypes";
import type { PlantOptionType } from "@/features/garden/gardenTypes";

function usePost(passedPost: PostType) {
    const [post, setPost] = useState<PostType>(passedPost);
    const [openEdit, setOpenEdit] = useState(false);

    const updatePost = useCallback(
        (
            newCaption: string,
            visibility: "everyone" | "private" | "for_me",
            plantTags: PlantOptionType[]
        ) => {
            setPost((prev) => ({
                ...prev,
                caption: newCaption,
                visibility: visibility,
                planttags: plantTags,
            }));
        },
        []
    );

    const setOpenEditCallback = useCallback((open: boolean) => {
        setOpenEdit(open);
    }, []);

    return {
        updatePost,
        post,
        openEdit,
        setOpenEditCallback,
    };
}

export default usePost;
