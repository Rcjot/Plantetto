import React, { useEffect, useState } from "react";
import PostCarousel from "./PostCarousel";
import postsApi from "@/api/postsApi";
import { usePostContext } from "./context/PostContext";
import { notifyRecentsUpdated } from "@/features/recent/recentService";
import { useAuthContext } from "../auth/AuthContext";
import type { PlantOptionType } from "../garden/gardenTypes";

interface Props {
    selectValue: "everyone" | "private" | "for_me";
    plantTags: PlantOptionType[];
}

function EditPostForm({ selectValue, plantTags }: Props) {
    const { post, updatePost, setOpenEditCallback } = usePostContext()!;
    const { auth } = useAuthContext()!;
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
        formData.append("visibility", selectValue);
        const stringified = JSON.stringify(plantTags.map((p) => p.id));
        formData.append("planttags", stringified);
        const { ok } = await postsApi.editPost(post.post_uuid, formData);

        if (ok) {
            updatePost(caption, selectValue, plantTags);
            if (auth.user?.id) {
                notifyRecentsUpdated(auth.user.id);
            }
        }

        setIsSubmitting(false);
        setOpenEditCallback(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="max-h-[700px] overflow-y-auto grid gap-y-3">
                <textarea
                    className="textarea w-full outline-none max-h-[350px] overflow-y-auto"
                    placeholder="What's growing today?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                {post.media.length > 0 && (
                    <div className="px-7">
                        <PostCarousel mediaList={post.media} />
                    </div>
                )}
            </div>
            <button
                className="btn btn-primary w-fit px-10 self-center mt-3"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Saving..." : "Save"}
            </button>
        </form>
    );
}

export default EditPostForm;
