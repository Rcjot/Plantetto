import postsApi from "@/api/postsApi";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PostType } from "@/features/posts/postTypes";
import PostCardProvider from "@/features/posts/context/PostProvider";
import { useParams } from "react-router-dom";

function UsersPostFeedSection() {
    const { username } = useParams();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const initialFetch = useRef(false);
    const infiniteTriggerRef = useRef(null);

    const fetchPosts = useCallback(async () => {
        if (!username) return;
        setLoading(true);
        const { posts: resPosts, nextCursor: resNextCursor } =
            await postsApi.fetchUserPosts(nextCursor, username);

        setPosts((prev) => [...prev, ...resPosts]);
        setHasMore(Boolean(resNextCursor));
        setNextCursor(resNextCursor);
        setLoading(false);
    }, [nextCursor, username]);

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        if (!infiniteTriggerRef.current) return;
        const observedRef = infiniteTriggerRef.current;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];

            if (entry.isIntersecting && !loading && hasMore) {
                setLoading(true);
                fetchPosts();
            }
        });

        observer.observe(infiniteTriggerRef.current);

        return () => {
            if (observedRef) observer.unobserve(observedRef);
            observer.disconnect();
        };
    }, [loading, fetchPosts, hasMore]);

    return (
        <div className="flex flex-col gap-10 w-full items-center">
            {" "}
            {posts.length > 0 &&
                posts.map((post) => {
                    return (
                        <div key={post.post_uuid} className="w-full max-w-2xl">
                            {" "}
                            <PostCardProvider passedPost={post} />
                        </div>
                    );
                })}
            {hasMore ? (
                <div ref={infiniteTriggerRef} className="w-full max-w-2xl">
                    {" "}
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex items-center gap-4 w-full">
                            <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                            <div className="flex flex-col gap-4 w-full">
                                <div className="skeleton h-4 w-full"></div>
                                <div className="skeleton h-4 w-full"></div>
                            </div>
                        </div>
                        <div className="skeleton h-32 w-full"></div>
                    </div>
                </div>
            ) : (
                <div className="self-center text-center">
                    {" "}
                    The roots rest here.. Why not sprout a new post?
                </div>
            )}
        </div>
    );
}

export default UsersPostFeedSection;
