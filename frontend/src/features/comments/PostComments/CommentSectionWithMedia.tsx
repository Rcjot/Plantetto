import { CommentCard2 } from "./CommentCard2";
import { CommentInputArea } from "./CommentInputArea";
import { useAuthContext } from "@/features/auth/AuthContext";
import { AlertCircle } from "lucide-react";
import useComments from "./hooks/useComments";
import { useEffect, useRef } from "react";

interface CommentSectionProps {
    postUuid: string;
}

export function CommentSectionWithMedia({ postUuid }: CommentSectionProps) {
    const {
        comments,
        totalCount,
        loading,
        error,
        handleAddComment,
        handleEditComment,
        handleDeleteComment,
        fetchComments,
        hasMore,
    } = useComments(postUuid);
    const authContext = useAuthContext();

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bottomRef.current) return;
        const observedBotRef = bottomRef.current;
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && hasMore && !loading) {
                fetchComments(false);
            }
        });

        observer.observe(bottomRef.current);

        return () => {
            if (observedBotRef) observer.unobserve(observedBotRef);
            observer.disconnect();
        };
    }, [fetchComments, hasMore, loading]);

    const isAuthenticated = authContext?.auth.status === "authenticated";
    const currentUser = authContext?.auth.user;

    return (
        <div className="mt-2 w-full max-w-full flex flex-col h-full min-h-[300px] ">
            <div className="flex-shrink-0 p-2">
                <p className="font-semibold">
                    Comments {comments.length > 0 && `(${totalCount})`}
                </p>
            </div>

            <div className="flex-grow min-h-0 overflow-y-auto p-2 space-y-4">
                {error && (
                    <div className="alert alert-error text-sm p-2 rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                        <button
                            onClick={() => {
                                fetchComments(true);
                            }}
                            className="btn btn-xs btn-ghost ml-auto"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {comments.length === 0 && !error ? (
                    <div className="text-center text-gray-500 py-8">
                        No comments yet.
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <CommentCard2
                                key={comment.uuid}
                                comment={comment}
                                currentUser={currentUser}
                                postUuid={postUuid}
                                onEdit={handleEditComment}
                                onDelete={handleDeleteComment}
                            />
                        ))}
                        {hasMore && (
                            <div className="flex w-full flex-col gap-4 max-w-[580px]">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="skeleton h-4 w-full"></div>
                                        <div className="skeleton h-4 w-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div
                            className="min-w-10 min-h-5 bg-none"
                            ref={bottomRef}
                        />
                    </>
                )}
            </div>

            <div className="flex-shrink-0 p-2 border-t mt-auto">
                <CommentInputArea
                    onAddComment={handleAddComment}
                    disabled={!isAuthenticated}
                    placeholder="Write a comment..."
                />
            </div>
        </div>
    );
}
