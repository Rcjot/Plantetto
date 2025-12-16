import ProfilePicture from "@/components/ProfilePicture";
import CreatePostDialog from "./CreatePostDialog";
import React, { useCallback, useMemo, useRef, useState } from "react";
import type { CreatePostFormType, MediaType, PostType } from "./postTypes";
import { CreatePostContext } from "./context/PostContext";
import PostCardProvider from "./context/PostProvider";
import type { PlantOptionType } from "../garden/gardenTypes";
import mediaIcon from "@/assets/icons/mediaIcon.svg";
import { toast } from "react-toastify";

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

    const mediaInputRef = useRef<HTMLInputElement>(null);
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

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;

        const files = Array.from(e.target.files);
        let invalid = false;
        const mediaUrlList: MediaType[] = files.map((file, index) => {
            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {
                toast.warn("Please select an image or video file.");
                invalid = true;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.warn("File size must be less than 10MB.");
                invalid = true;
            }
            return {
                url: URL.createObjectURL(file),
                type: file.type.startsWith("image") ? "image" : "video",
                order: index,
            };
        });
        if (invalid) {
            return;
        }
        setCreatePostForm((prev) => ({
            ...prev,
            media: [...prev.media, ...files],
            preview: [...prev.preview, ...mediaUrlList],
        }));
        setOpen(true);
    }

    return (
        <>
            <CreatePostContext.Provider value={contextValue}>
                <input
                    ref={mediaInputRef}
                    type="file"
                    name="media"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleImage}
                    multiple
                />
                <div className="card sm:w-full max-w-[650px] bg-base-100 card-md shadow-lg p-4 pb-10 flex flex-col gap-5">
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
                        <button
                            type="button"
                            className="cursor-pointer  hover:bg-base-300 rounded-sm p-1"
                            onClick={() => {
                                mediaInputRef.current?.click();
                            }}
                        >
                            <img
                                src={mediaIcon}
                                className="w-8 h-8  "
                                alt="add media"
                            />
                        </button>
                    </div>
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
