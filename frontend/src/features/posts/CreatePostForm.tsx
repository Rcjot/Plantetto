import mediaIcon from "@/assets/icons/mediaIcon.svg";
import { useRef, useState } from "react";
import PostCarousel from "./PostCarousel";
import type { MediaType } from "./postTypes";
import postsApi from "@/api/postsApi";
import { useCreatePostContext } from "./context/PostContext";

function CreatePostForm({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const {
        createPostForm,
        setCreatePostForm,
        caption,
        setCaption,
        appendPost,
    } = useCreatePostContext()!;
    // const [preview, setPreview] = useState<MediaType[]>([]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<{
        caption: string;
        media: string;
        root: string;
    }>({
        caption: "",
        media: "",
        root: "",
    });

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        const files = Array.from(e.target.files);
        const mediaUrlList: MediaType[] = files.map((file, index) => {
            return {
                url: URL.createObjectURL(file),
                type: file.type.startsWith("image") ? "image" : "video",
                order: index,
            };
        });
        setCreatePostForm((prev) => ({
            ...prev,
            media: [...prev.media, ...files],
            preview: [...prev.preview, ...mediaUrlList],
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("caption", caption);
        createPostForm.media.forEach((file) => formData.append("media", file));
        const { ok, newPost, resErrors } = await postsApi.createPost(formData);
        setIsSubmitting(false);
        if (!ok || !newPost) {
            console.error("failed to create post");
            const constructedErrors = {
                caption: resErrors.caption[0],
                media: resErrors.media[0],
                root: resErrors.root[0],
            };
            setErrors(constructedErrors);
            return;
        }
        setCreatePostForm((prev) => ({
            ...prev,
            media: [],
            preview: [],
        }));
        setCaption("");
        setOpen(false);
        appendPost(newPost);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className=" max-h-[700px] overflow-y-auto grid gap-y-3">
                    <input
                        ref={mediaInputRef}
                        type="file"
                        name="media"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={handleImage}
                        multiple
                    />
                    <div>
                        <textarea
                            className="textarea w-full outline-none max-h-[350px] overflow-y-auto"
                            placeholder="What's growing today?"
                            value={caption}
                            onChange={(e) => {
                                setCaption(e.target.value);
                            }}
                        ></textarea>
                        <span className="text-warning-content">
                            {errors.caption}
                        </span>
                    </div>
                    {createPostForm.media.length > 0 && (
                        <>
                            <button
                                className="btn btn-warning w-fit h-fit self-end ml-auto"
                                onClick={() => {
                                    setCreatePostForm((prev) => ({
                                        ...prev,
                                        media: [],
                                        preview: [],
                                    }));
                                }}
                            >
                                clear
                            </button>
                            <div className="px-7">
                                <PostCarousel
                                    mediaList={createPostForm.preview}
                                />
                            </div>
                        </>
                    )}
                    <span className="text-warning-content">{errors.media}</span>
                </div>
                <div className="card w-full card-md border p-1 flex-row justify-between ">
                    <button
                        type="button"
                        onClick={() => {
                            mediaInputRef.current?.click();
                        }}
                    >
                        <h1 className="hover:bg-base-300 p-1 rounded-full px-3 w-fit cursor-pointer">
                            Add to your post
                        </h1>
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer mr-10 hover:bg-base-300 rounded-sm p-1"
                        onClick={() => {
                            mediaInputRef.current?.click();
                        }}
                    >
                        <img
                            src={mediaIcon}
                            className="w-10 h-10  "
                            alt="add media"
                        />
                    </button>
                </div>
                <span className="text-warning-content">{errors.root}</span>

                <button
                    className="btn btn-primary w-fit px-10 self-center"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Posting..." : "Post"}
                </button>
            </form>
        </>
    );
}

export default CreatePostForm;
