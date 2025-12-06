import { ThumbsUp, Bookmark } from "lucide-react";
import { GuideCommentIcon } from "../comments/GuideComments/GuideCommentIcon";
import type { GuideType } from "./guideTypes";
import { Link } from "react-router-dom";

interface GuideInteractiveButtonTypes {
    guide: GuideType;
}

export function GuideInteractiveButton({ guide }: GuideInteractiveButtonTypes) {
    return (
        <div className="flex flex-row gap-1 items-center">
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
                onClick={(e) => e.stopPropagation()}
            >
                <ThumbsUp
                    size={22}
                    className="hover:scale-115 hover:fill-neutral hover:text-neutral transition-colors"
                />
            </div>

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
                onClick={(e) => e.stopPropagation()}
            >
                <Bookmark
                    size={22}
                    className="hover:scale-115 hover:fill-neutral hover:text-neutral transition-colors"
                />
            </div>
        </div>
    );
}
