import { CommentIconButton } from "@/features/comments/PostComments/CommentIconButton";
import { ThumbsUp, Bookmark } from "lucide-react";
import type { PostType } from "./postTypes";
import { useState } from "react";
import likesApi from "@/api/likesApi";
import bookmarksApi from "@/api/bookmarksApi";

interface InteractionButtonProps {
    post: PostType;
}

export function InteractionButton({ post }: InteractionButtonProps) {
    const [isLiked, setIsLiked] = useState(post.liked);
    const [likeCount, setLikeCount] = useState(post.like_count);
    const [isBookmarked, setIsBookmarked] = useState(post.bookmarked);

    async function toggleLikePost() {
        const { ok, action } = await likesApi.toggleLikePost(post.post_uuid);
        if (ok) {
            setIsLiked(action === "like");
            setLikeCount((prev) => {
                if (action === "like") {
                    return prev + 1;
                } else {
                    return prev - 1;
                }
            });
        }
    }

    async function toggleBookmarkPost() {
        const { ok, action } = await bookmarksApi.toggleBookmarkPost(
            post.post_uuid
        );
        if (ok) {
            setIsBookmarked(action === "bookmark");
        }
    }

    return (
        <>
            <div className="flex flex-row gap-2">
                <div className="flex flex-row items-center">
                    <button
                        className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLikePost();
                        }}
                    >
                        <ThumbsUp
                            className={`hover:scale-115  hover:text-neutral transition-colors ${isLiked && "fill-success"} `}
                        />
                    </button>
                    <div className="min-w-[20px] text-center">
                        <span className="text-sm font-medium text-gray-500">
                            {likeCount}
                        </span>
                    </div>
                </div>
                <div>
                    <CommentIconButton post={post} />
                </div>
                <div>
                    <button
                        className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmarkPost();
                        }}
                    >
                        <Bookmark
                            className={`hover:scale-115  hover:text-neutral transition-colors ${isBookmarked && "fill-success"} `}
                        />
                    </button>
                </div>
            </div>
        </>
    );
}

export default InteractionButton;