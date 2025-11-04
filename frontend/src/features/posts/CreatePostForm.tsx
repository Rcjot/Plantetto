import mediaIcon from "@/assets/icons/mediaIcon.svg";
import { useRef, useState } from "react";
import PostCarousel from "./PostCarousel";
import type { MediaType } from "./postTypes";
import postsApi from "@/api/postsApi";

function CreatePostForm() {
    const mediaInputRef = useRef<HTMLInputElement>(null);
    const [media, setMedia] = useState<File[]>([]);
    const [preview, setPreview] = useState<MediaType[]>([]);

    const [caption, setCaption] = useState<string>("");

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.files);
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        const files = Array.from(e.target.files);
        const mediaUrlList: MediaType[] = files.map((file, i) => {
            return {
                url: URL.createObjectURL(file),
                type: file.type.startsWith("image") ? "image" : "video",
                order: i,
            };
        });
        setMedia((prev) => [...prev, ...files]);
        setPreview((prev) => [...prev, ...mediaUrlList]);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("caption", caption);
        media.forEach((file) => formData.append("media", file));
        await postsApi.createPost(formData);
        setIsSubmitting(false);
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
                    <textarea
                        className="textarea w-full outline-none max-h-[350px] overflow-y-auto"
                        placeholder="What's growing today?"
                        value={caption}
                        onChange={(e) => {
                            setCaption(e.target.value);
                        }}
                    ></textarea>
                    {media.length > 0 && (
                        <>
                            <button
                                className="btn btn-warning w-fit h-fit self-end ml-auto"
                                onClick={() => {
                                    setMedia([]);
                                    setPreview([]);
                                }}
                            >
                                clear
                            </button>
                            <div className="px-7">
                                <PostCarousel mediaList={preview} />
                            </div>
                        </>
                    )}
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
