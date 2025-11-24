import { useState, useEffect, useRef } from "react";
import postsApi from "@/api/postsApi";
import type { PostType } from "@/features/posts/postTypes";
import PostCardProvider from "@/features/posts/context/PostProvider";

interface Props {
    search: string;
    origin?: string;
}

export default function SearchResultsPosts({
    search,
    origin = "/home",
}: Props) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const infiniteTriggerRef = useRef<HTMLDivElement | null>(null);
    const initialFetchDone = useRef(false);

    const fetchPosts = async (cursor: string | null = null, reset = false) => {
        if (!search.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { posts: resPosts, nextCursor: newCursor } =
                await postsApi.explorePosts(search, cursor);

            setPosts((prev) => (reset ? resPosts : [...prev, ...resPosts]));
            setNextCursor(newCursor);
            setHasMore(Boolean(newCursor));
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("Failed to load posts");
        } finally {
            setLoading(false);
            initialFetchDone.current = true;
        }
    };

    useEffect(() => {
        setPosts([]);
        setNextCursor(null);
        setHasMore(true);
        if (!search.trim()) return;
        fetchPosts(null, true);
    }, [search]);

    useEffect(() => {
        if (!infiniteTriggerRef.current || !search.trim()) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (
                    entry.isIntersecting &&
                    !loading &&
                    hasMore &&
                    initialFetchDone.current
                ) {
                    fetchPosts(nextCursor);
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(infiniteTriggerRef.current);
        return () => observer.disconnect();
    }, [loading, hasMore, nextCursor, search]);

    if (loading && posts.length === 0) {
        return (
            <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
                <div className="flex flex-col gap-4">
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
        );
    }

    if (error && posts.length === 0) {
        return <div className="py-8 text-center text-error">{error}</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="py-8 text-center text-neutral-500">
                No sprouts found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 pb-12 w-full">
            {posts.map((post) => (
                <div key={post.post_uuid} className="w-full max-w-2xl mx-auto">
                    <PostCardProvider passedPost={post} origin={origin} />
                </div>
            ))}

            {hasMore ? (
                <div
                    ref={infiniteTriggerRef}
                    className="w-full max-w-2xl mx-auto flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-4">
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
                <div className="self-center py-8 text-neutral-500">
                    There’s no more sprouts 🌱
                </div>
            )}
        </div>
    );
}
