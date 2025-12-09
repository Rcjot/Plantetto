import { ThumbsUp, Bookmark } from "lucide-react";
import { GuideCommentIcon } from "../comments/GuideComments/GuideCommentIcon";
import type { GuideType } from "./guideTypes";
import { Link } from "react-router-dom";
import { useState } from "react";
import likesApi from "@/api/likesApi";
import bookmarksApi from "@/api/bookmarksApi";

interface GuideInteractiveButtonTypes {
    guide: GuideType;
}

export function GuideInteractiveButton({ guide }: GuideInteractiveButtonTypes) {
    const [isLiked, setIsLiked] = useState(guide.liked);
    const [likeCount, setLikeCount] = useState(guide.like_count);
    const [isBookmarked, setIsBookmarked] = useState(guide.bookmarked);

    async function toggleLikeGuide() {
        const { ok, action } = await likesApi.toggleLikeGuide(guide.uuid);
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

    async function toggleBookmarkGuide() {
        const { ok, action } = await bookmarksApi.toggleBookmarkGuide(
            guide.uuid
        );
        if (ok) {
            setIsBookmarked(action === "bookmark");
        }
    }

    return (
        <div className="flex flex-row gap-1 items-center">
            <div className="flex flex-row items-center">
                <div
                    role="button"
                    tabIndex={0}
                    className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none cursor-pointer"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            // Handle like action
                        }
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeGuide();
                    }}
                >
                    <ThumbsUp
                        size={22}
                        className={`hover:scale-115  hover:text-neutral transition-colors ${isLiked && "fill-success"} `}
                    />
                </div>
                <div className="min-w-[20px] text-center">
                    <span className="text-sm font-medium text-gray-500">
                        {likeCount}
                    </span>
                </div>
            </div>

            {/* This is now a div, not a button */}
            <div className="flex items-center gap-0">
                <Link to={`/guides/${guide.uuid}`}>
                    <GuideCommentIcon />
                </Link>
                <div className="min-w-[20px] text-center">
                    <span className="text-sm font-medium text-gray-500">
                        {guide.comment_count}
                    </span>
                </div>
            </div>

            <div
                role="button"
                tabIndex={0}
                className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none cursor-pointer"
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        // Handle bookmark action
                    }
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmarkGuide();
                }}
            >
                <Bookmark
                    size={22}
                    className={`hover:scale-115 hover:text-neutral transition-colors ${
                        isBookmarked ? "fill-success text-neutral" : ""
                    }`}
                />
            </div>
        </div>
    );
}