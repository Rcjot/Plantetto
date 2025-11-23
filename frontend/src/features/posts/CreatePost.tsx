import ProfilePicture from "@/components/ProfilePicture";
import CreatePostDialog from "./CreatePostDialog";
import React, { useCallback, useMemo, useState } from "react";
import type { CreatePostFormType, PostType } from "./postTypes";
import { CreatePostContext } from "./context/PostContext";
import PostCardProvider from "./context/PostProvider";
import type { PlantOptionType } from "../garden/gardenTypes";

function CreatePost({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [addedPosts, setAddedPosts] = useState<PostType[]>([]);
    const [createPostForm, setCreatePostForm] = useState<CreatePostFormType>({
        media: [],
        preview: [],
    });
    const [caption, setCaption] = useState("");
    const [visibility, setVisibility] = useState<
        "everyone" | "private" | "for_me"
    >("everyone");
    const [plantTags, setPlantTags] = useState<PlantOptionType[]>([]);

    const appendPost = useCallback((newPost: PostType) => {
        setAddedPosts((prev) => [newPost, ...prev]);
    }, []);

    const contextValue = useMemo(
        () => ({
            createPostForm,
            setCreatePostForm,
            caption,
            setCaption,
            visibility,
            setVisibility,
            plantTags,
            setPlantTags,
            appendPost,
        }),
        [
            createPostForm,
            setCreatePostForm,
            caption,
            setCaption,
            visibility,
            setVisibility,
            plantTags,
            setPlantTags,
            appendPost,
        ]
    );

    return (
        <>
            <CreatePostContext.Provider value={contextValue}>
                <div className="card sm:w-full max-w-[650px] bg-base-100 card-md shadow-lg p-4 flex flex-col gap-5">
                    <div className="flex gap-1">
                        <ProfilePicture />
                        <button
                            className="border-b border-base-300 cursor-pointer flex-1 text-start"
                            onClick={() => setOpen(true)}
                        >
                            <p className="hover:bg-base-300 p-1 rounded-full px-3">
                                What's growing today?
                            </p>
                        </button>
                    </div>
                    <button
                        className="btn btn-primary w-fit h-fit px-4 py-1 self-end"
                        onClick={() => setOpen(true)}
                    >
                        Post
                    </button>
                </div>
                <CreatePostDialog open={open} setOpen={setOpen} />
            </CreatePostContext.Provider>
            {children}
            <div className="flex flex-col gap-10 w-full">
                {addedPosts.length > 0 &&
                    addedPosts.map((post) => {
                        return (
                            <PostCardProvider
                                key={post.post_uuid}
                                passedPost={post}
                            />
                        );
                    })}
            </div>
        </>
    );
}

export default CreatePost;
