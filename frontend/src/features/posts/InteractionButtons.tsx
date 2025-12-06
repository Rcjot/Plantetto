import { CommentIconButton } from "@/features/comments/PostComments/CommentIconButton";
import { ThumbsUp, Bookmark } from "lucide-react";
import type { PostType } from "./postTypes";

interface InteractionButtonProps {
    post: PostType;
}

export function InteractionButton({ post }: InteractionButtonProps) {
    return (
        <>
            <div className="flex flex-row gap-2">
                <div>
                    <button
                        className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none"
                        onClick={(e) => e.stopPropagation()}
                        disabled={true}
                    >
                        <ThumbsUp className="hover:scale-115 hover:fill-neutral hover:text-neutral transition-colors" />
                    </button>
                </div>
                <div>
                    <CommentIconButton post={post} />
                </div>
                <div>
                    <button
                        className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none"
                        onClick={(e) => e.stopPropagation()}
                        disabled={true}
                    >
                        <Bookmark className="hover:scale-115 hover:fill-neutral hover:text-neutral transition-colors" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default InteractionButton;
