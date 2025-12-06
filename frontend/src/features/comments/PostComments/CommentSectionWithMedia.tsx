import { useState, useEffect } from "react";
import { CommentCard2 } from "./CommentCard2";
import { CommentInputArea } from "./CommentInputArea";
import type { CommentType } from "../commentTypes";
import { useAuthContext } from "@/features/auth/AuthContext";
import { AlertCircle } from "lucide-react";
import commentsPostsApi from "@/api/commentsPostsApi";

interface CommentSectionProps {
    postUuid: string;
}

export function CommentSectionWithMedia({ postUuid }: CommentSectionProps) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const authContext = useAuthContext();

    const fetchComments = async () => {
        if (!postUuid) {
            console.warn("⚠️ No Post UUID provided, skipping fetch.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result =
                await commentsPostsApi.getCommentsUnderPost(postUuid);

            if (result.ok) {
                // Always handle comments, even if it's an empty array
                const commentsArray = result.comments || [];

                // Map the API response to match CommentType
                const mappedComments: CommentType[] = commentsArray.map(
                    (comment: any) => ({
                        ...comment,
                        author: {
                            ...comment.author,
                            display_name: comment.author.display_name || "", // Convert null to empty string
                        },
                        last_edit_date: comment.last_edit_date || null,
                        parent_uuid: comment.parent_uuid || null,
                    })
                );
                setComments(mappedComments);
            } else {
                setError("Failed to load comments 1.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load comments. 2");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (content: string) => {
        if (!authContext?.auth.user) return false;

        try {
            const result = await commentsPostsApi.addComment(
                postUuid,
                content,
                "" // Empty string for parent_uuid since we're not using replies
            );

            if (result.ok) {
                await fetchComments();
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const handleEditComment = async (
        commentUuid: string,
        newContent: string
    ) => {
        try {
            const result = await commentsPostsApi.patchContent(
                postUuid,
                commentUuid,
                newContent
            );

            if (result.ok) {
                // Optimistically update the UI
                setComments((prev) =>
                    prev.map((c) =>
                        c.uuid === commentUuid
                            ? {
                                  ...c,
                                  content: newContent,
                                  last_edit_date: new Date().toISOString(),
                              }
                            : c
                    )
                );
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const handleDeleteComment = async (commentUuid: string) => {
        try {
            const result = await commentsPostsApi.deleteComment(
                postUuid,
                commentUuid
            );

            if (result.ok) {
                // Optimistically remove from UI
                setComments((prev) =>
                    prev.filter((c) => c.uuid !== commentUuid)
                );
                return true;
            }
            return false;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    useEffect(() => {
        if (postUuid) fetchComments();
    }, [postUuid]);

    const isAuthenticated = authContext?.auth.status === "authenticated";
    const currentUser = authContext?.auth.user;

    return (
        <div className="mt-2 w-full max-w-full flex flex-col h-full min-h-[300px] ">
            <div className="flex-shrink-0 p-2">
                <p className="font-semibold">
                    Comments {comments.length > 0 && `(${comments.length})`}
                </p>
            </div>

            <div className="flex-grow min-h-0 overflow-y-auto p-2 space-y-4">
                {error && (
                    <div className="alert alert-error text-sm p-2 rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                        <button
                            onClick={fetchComments}
                            className="btn btn-xs btn-ghost ml-auto"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-4">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : comments.length === 0 && !error ? (
                    <div className="text-center text-gray-500 py-8">
                        No comments yet.
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentCard2
                            key={comment.uuid}
                            comment={comment}
                            currentUser={currentUser}
                            postUuid={postUuid}
                            onEdit={handleEditComment}
                            onDelete={handleDeleteComment}
                        />
                    ))
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
