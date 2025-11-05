import postsApi from "@/api/postsApi";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PostType } from "./postTypes";
import PostCardProvider from "./context/PostProvider";

function FeedSection() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const initialFetch = useRef(false);
    const infiniteTriggerRef = useRef(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        const { posts: resPosts, nextCursor: resNextCursor } =
            await postsApi.fetchPosts(nextCursor);
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(resPosts, "triggered");
        setPosts((prev) => [...prev, ...resPosts]);
        setHasMore(Boolean(resNextCursor));
        setNextCursor(resNextCursor);
        setLoading(false);
    }, [nextCursor]);

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        console.log("fetched init", nextCursor);
        fetchPosts();
    }, [fetchPosts, nextCursor]);

    useEffect(() => {
        if (!infiniteTriggerRef.current) return;
        const observedRef = infiniteTriggerRef.current;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];

            if (entry.isIntersecting && !loading && hasMore) {
                console.log("fetching loading was false");
                setLoading(true);
                fetchPosts();
            } else {
                console.log("not fetching! currently loading");
            }
        });
        observer.observe(infiniteTriggerRef.current);
        return () => {
            if (observedRef) observer.unobserve(observedRef);
            observer.disconnect();
        };
    }, [loading, fetchPosts, hasMore]);

    return (
        <div className="flex flex-col gap-10 w-full">
            {posts.length > 0 &&
                posts.map((post) => {
                    return (
                        <PostCardProvider
                            key={post.post_uuid}
                            passedPost={post}
                        />
                    );
                })}

            {hasMore ? (
                <div ref={infiniteTriggerRef} className="">
                    <div className="flex w-full flex-col gap-4 max-w-[580px]">
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
                <div className="self-center">you have reached the bottom</div>
            )}
        </div>
    );
}

export default FeedSection;