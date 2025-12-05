import type { PostType } from "@/features/posts/postTypes";
import { MessageCircle } from "lucide-react";

interface CommentIconButtonProps {
    post: PostType;
}

export function CommentIconButton({ post }: CommentIconButtonProps) {
    return (
        <div className="flex flex-row items-center">
            <button className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none">
                <MessageCircle className="hover:scale-115 hover:fill-neutral hover:text-neutral transition-colors" />
            </button>
            <div className="min-w-[20px] text-center">
                <span className="text-sm font-medium text-gray-500">
                    {post.comment_count}
                </span>
            </div>
        </div>
    );
}

export default CommentIconButton;
