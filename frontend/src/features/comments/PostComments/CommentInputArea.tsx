// features/comments/CommentInputArea.tsx
import { useState } from "react";

interface CommentInputAreaProps {
    onAddComment: (content: string) => Promise<boolean>;
    disabled?: boolean;
    placeholder?: string;
}

export function CommentInputArea({
    onAddComment,
    disabled = false,
    placeholder = "Add Comments Here",
}: CommentInputAreaProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        const success = await onAddComment(content);
        if (success) {
            setContent("");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="join w-full">
            <input
                type="text"
                placeholder={placeholder}
                className="input input-bordered join-item w-full focus:outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={disabled || isSubmitting}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                }}
            />
            <button
                className="btn btn-neutral join-item"
                onClick={handleSubmit}
                disabled={disabled || isSubmitting || !content.trim()}
            >
                {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                ) : (
                    "Post"
                )}
            </button>
        </div>
    );
}

export default CommentInputArea;
