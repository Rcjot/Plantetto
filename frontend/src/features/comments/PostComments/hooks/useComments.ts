import { useCallback, useEffect, useRef, useState } from "react";
import type { CommentType } from "../../commentTypes";
import commentsPostsApi from "@/api/commentsPostsApi";
import { useAuthContext } from "@/features/auth/AuthContext";

function useComments(postUuid: string) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { auth } = useAuthContext()!;

    const nextCursor = useRef<string | null>(null);
    const initialFetch = useRef(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const fetchComments = useCallback(
        async (reset = false) => {
            console.log(reset);
            const modifiedNextCursor = reset ? null : nextCursor.current;

            console.log("modified", modifiedNextCursor);
            setLoading(true);
            try {
                const {
                    ok,
                    comments,
                    totalCount,
                    nextCursor: nextCursorRes,
                } = await commentsPostsApi.getCommentsUnderPost(
                    postUuid,
                    modifiedNextCursor
                );

                if (ok) {
                    if (reset) {
                        setComments(comments);
                    } else {
                        setComments((prev) => [...prev, ...comments]);
                    }
                    setHasMore(Boolean(nextCursorRes));
                    nextCursor.current = nextCursorRes;

                    setTotalCount(totalCount);
                } else {
                    setError("Failed to load comments. 1");
                }
            } catch (error) {
                console.error(error);
                setError("Failed to load comments. 2");
            } finally {
                setLoading(false);
            }
        },
        [postUuid]
    );

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        fetchComments();
    }, [fetchComments]);

    const handleAddComment = async (content: string) => {
        if (!auth.user) return false;

        try {
            const result = await commentsPostsApi.addComment(
                postUuid,
                content,
                "" // Empty string for parent_uuid since we're not using replies
            );

            if (result.ok) {
                await fetchComments(true);
                sectionRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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

    return {
        comments,
        totalCount,
        loading,
        error,
        handleAddComment,
        handleEditComment,
        handleDeleteComment,
        fetchComments,
        hasMore,
        sectionRef,
    };
}

export default useComments;
