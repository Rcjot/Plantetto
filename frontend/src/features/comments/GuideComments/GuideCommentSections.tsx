import { GuideCommentCard } from "./GuideCommentCard";
import { GuidesCommentInputArea } from "@/features/comments/GuideComments/GuideInputCommentArea";
import { useEffect, useState } from "react";
import type { CommentType } from "../commentTypes";
import commentsGuidesApi from "@/api/commentsGuidesApi";
import useAuth from "@/features/auth/useAuth";
import { Loader2 } from "lucide-react";

interface GuideCommentSectionProps {
    guideUuid: string;
}

export function GuideCommentSection({ guideUuid }: GuideCommentSectionProps) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { auth } = useAuth();

    const fetchComments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Fetching comments for guide:", guideUuid);
            const result =
                await commentsGuidesApi.getCommentsUnderGuide(guideUuid);

            console.log("API Result:", result);

            if (result.ok) {
                // Check if result.comments exists
                const apiComments = result.comments || [];
                console.log("API Comments:", apiComments);

                // Transform API response to CommentType
                const transformedComments: CommentType[] = apiComments.map(
                    (comment: any) => ({
                        uuid: comment.uuid,
                        content: comment.content,
                        created_at: comment.created_at,
                        last_edit_date: comment.last_edit_date,
                        author: {
                            id: comment.author.id,
                            username: comment.author.username,
                            display_name:
                                comment.author.display_name ||
                                comment.author.username,
                            pfp_url: comment.author.pfp_url,
                        },
                        parent_uuid: comment.parent_uuid,
                    })
                );

                console.log("Transformed Comments:", transformedComments);

                // Filter to show only top-level comments (no parent)
                const topLevelComments = transformedComments.filter(
                    (comment) => !comment.parent_uuid
                );

                console.log("Top Level Comments:", topLevelComments);
                setComments(topLevelComments);
            } else {
                console.error("API returned not ok:", result);
                setError("Failed to load comments");
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            setError("An error occurred while loading comments");
        } finally {
            setIsLoading(false);
            console.log("Loading complete, comments:", comments.length);
        }
    };

    useEffect(() => {
        if (guideUuid) {
            fetchComments();
        }
    }, [guideUuid]);

    const handleCommentAdded = () => {
        fetchComments();
    };

    const handleEditSuccess = () => {
        fetchComments();
    };

    const handleDeleteSuccess = () => {
        fetchComments();
    };

    console.log("Render state:", {
        isLoading,
        error,
        commentsCount: comments.length,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row">
                    <p className="text-2xl">Comments</p>
                </div>
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    <span className="ml-2 text-gray-600">
                        Loading comments...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col border gap-2 p-6">
                <div className="flex flex-row">
                    <p className="text-2xl">Comments</p>
                </div>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <button
                        onClick={fetchComments}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-row">
                <p className="text-2xl font-semibold">Comments</p>
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {comments.length}
                </span>
            </div>

            {/* Comment Input Area */}
            <div className="mt-4">
                <GuidesCommentInputArea
                    guideUuid={guideUuid}
                    onCommentAdded={handleCommentAdded}
                />
            </div>

            {/* Comments List */}
            <div className="mt-2">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-lg">No comments yet</p>
                        <p className="text-sm mt-1">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <GuideCommentCard
                                key={comment.uuid}
                                comment={comment}
                                currentUser={auth.user}
                                guideUuid={guideUuid}
                                onEditSuccess={handleEditSuccess}
                                onDeleteSuccess={handleDeleteSuccess}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
