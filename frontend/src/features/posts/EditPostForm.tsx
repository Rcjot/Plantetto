import React, { useEffect, useState } from "react";
import PostCarousel from "./PostCarousel";
import postsApi from "@/api/postsApi";
import { usePostContext } from "./context/PostContext";

function EditPostForm() {
    const { post, updateCaption, setOpenEditCallback } = usePostContext()!;
    const [caption, setCaption] = useState<string>(post.caption);

    useEffect(() => {
        setCaption(post.caption);
    }, [post]);

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("caption", caption);
        const { ok } = await postsApi.editPost(post.post_uuid, formData);
        if (ok) {
            updateCaption(caption);
        }
        setIsSubmitting(false);
        setOpenEditCallback(false);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className=" max-h-[700px] overflow-y-auto grid gap-y-3">
                    <textarea
                        className="textarea w-full outline-none max-h-[350px] overflow-y-auto"
                        placeholder="What's growing today?"
                        value={caption}
                        onChange={(e) => {
                            setCaption(e.target.value);
                        }}
                    ></textarea>
                    {post.media.length > 0 && (
                        <>
                            <div className="px-7">
                                <PostCarousel mediaList={post.media} />
                            </div>
                        </>
                    )}
                </div>

                <button
                    className="btn btn-primary w-fit px-10 self-center"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </form>
        </>
    );
}

export default EditPostForm;
