import { useState } from "react";
import useAuth from "@/features/auth/useAuth";
import { Link } from "react-router-dom";
import commentsGuidesApi from "@/api/commentsGuidesApi";

interface GuidesCommentInputAreaProps {
    guideUuid: string;
    onCommentAdded: () => void;
}

export function GuidesCommentInputArea({
    guideUuid,
    onCommentAdded,
}: GuidesCommentInputAreaProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { auth } = useAuth();

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError("Comment cannot be empty");
            return;
        }

        if (auth.status !== "authenticated" || !auth.user) {
            setError("You must be logged in to comment");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const result = await commentsGuidesApi.addComment(
                guideUuid,
                content,
                "" // Pass empty string for top-level comments instead of null
            );

            if (result.ok) {
                setContent("");
                onCommentAdded(); // Notify parent to refresh comments
            } else {
                setError(result.errors?.root?.[0] || "Failed to post comment");
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            setError("An error occurred while posting comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isSubmitting) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Show login prompt if user is not authenticated
    if (auth.status !== "authenticated") {
        return (
            <div className="join w-full">
                <input
                    type="text"
                    placeholder="Sign in to post a comment"
                    className="input flex-grow w-[85%]"
                    value=""
                    disabled
                />
                <Link to="/login" className="btn btn-neutral join-item w-[15%]">
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="join w-full">
                <input
                    type="text"
                    placeholder="Type comment here"
                    className="input flex-grow w-[85%]"
                    value={content || ""}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting}
                    maxLength={500}
                />
                <button
                    className="btn btn-neutral join-item w-[15%]"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !content.trim()}
                >
                    {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Post"
                    )}
                </button>
            </div>
            {error && (
                <div className="mt-2">
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                </div>
            )}
            <div className="mt-8">
                <hr className="border-gray-300" />
            </div>
        </>
    );
}
