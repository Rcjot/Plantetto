import { useCallback, useEffect, useRef, useState } from "react";
import bookmarksApi from "@/api/bookmarksApi";
import type { PostType } from "@/features/posts/postTypes";
import PostCardProvider from "@/features/posts/context/PostProvider";

function BookmarkedPostsFeed() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    const initialFetch = useRef(false);
    const infiniteTriggerRef = useRef<HTMLDivElement>(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        const {
            posts: resPosts,
            nextCursor: resNextCursor,
            ok,
        } = await bookmarksApi.fetchBookmarkedPosts(nextCursor);

        if (ok) {
            if (Array.isArray(resPosts)) {
                setPosts((prev) => [...prev, ...resPosts]);
                setNextCursor(resNextCursor || null);
                setHasMore(Boolean(resNextCursor));
            } else {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
        setLoading(false);
    }, [nextCursor]);

    useEffect(() => {
        if (initialFetch.current) return;
        initialFetch.current = true;
        fetchPosts();
    }, []);

    useEffect(() => {
        if (!infiniteTriggerRef.current) return;
        const observedRef = infiniteTriggerRef.current;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && !loading && hasMore) {
                fetchPosts();
            }
        });
        observer.observe(observedRef);
        return () => {
            if (observedRef) observer.unobserve(observedRef);
            observer.disconnect();
        };
    }, [loading, hasMore, fetchPosts]);

    return (
        <div className="flex flex-col gap-4 w-full pb-10">
            {posts.length > 0
                ? posts.map((post) => (
                      <div key={post.post_uuid} className="w-full">
                          <PostCardProvider
                              passedPost={post}
                              origin="/bookmarks"
                          />
                      </div>
                  ))
                : !loading && (
                      <div className="text-center text-gray-500 mt-10">
                          You haven't bookmarked any posts yet.
                      </div>
                  )}

            {hasMore && (
                <div
                    ref={infiniteTriggerRef}
                    className="w-full flex justify-center py-4"
                >
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
            )}

            {!hasMore && posts.length > 0 && (
                <div className="self-center text-center text-gray-400">
                    No more bookmarks to load.
                </div>
            )}
        </div>
    );
}

export default BookmarkedPostsFeed;