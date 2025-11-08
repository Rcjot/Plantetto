import { Button } from "@/components/ui/button";
import { RecentCard } from "./RecentCard";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/features/auth/AuthContext";
import postsApi from "@/api/postsApi";
import { clearRecents, getRecentPostUUIDs, onRecentsUpdated } from "./recentService";
import type { PostType } from "@/features/posts/postTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { addRecentPost } from "./recentService";

export function RecentBlock() {
    const { auth } = useAuthContext()!;
    const userId = auth.user?.id ?? null;
    const [recentPosts, setRecentPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    function timeAgo(dateString: string) {
        const then = new Date(dateString).getTime();
        const now = Date.now();
        const diff = Math.max(0, Math.floor((now - then) / 1000));
        if (diff < 60) return `${diff}s ago`;
        const m = Math.floor(diff / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        const d = Math.floor(h / 24);
        return `${d}d ago`;
    }

    const canUseRecents = useMemo(() => Boolean(userId), [userId]);

    const loadRecents = async () => {
        if (!userId) return;
        setLoading(true);
        const uuids = getRecentPostUUIDs(userId);
        if (uuids.length === 0) {
            setRecentPosts([]);
            setLoading(false);
            return;
        }
        // Fetch in order
        const results: PostType[] = [];
        const stillValid: string[] = [];
        for (const id of uuids) {
            try {
                const post = await postsApi.fetchPostByUUID(id);
                // Exclude user's own posts defensively
                if (post.author.id === userId) continue;
                results.push(post);
                stillValid.push(id);
            } catch {
                // skip invalid/deleted
            }
        }
        setRecentPosts(results);
        // prune any invalid/deleted entries
        if (stillValid.length !== uuids.length) {
            // update storage silently
            localStorage.setItem(`recent:${userId}`, JSON.stringify(stillValid));
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!canUseRecents) return;
        loadRecents();
        const off = onRecentsUpdated((e) => {
            if (e.detail.userId === userId) loadRecents();
        });
        // also refresh on focus to catch edits/deletes
        const onFocus = () => loadRecents();
        window.addEventListener("focus", onFocus);
        return () => {
            off();
            window.removeEventListener("focus", onFocus);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canUseRecents, userId]);

    return (
        <div className="w-[300px] rounded-md shadow-sm shadow-teal-500 flex flex-col items-center py-2 pl-[5px]">
            <div className="flex flex-col gap-3 w-full items-center">
                {/* Header */}
                <div className="flex flex-row justify-between items-center w-[90%]">
                    <p className="font-semibold text-emerald">Recently Viewed</p>
                    <Button
                        variant="ghost"
                        className="text-sm text-gray-500 hover:text-white"
                        onClick={() => {
                            if (userId) {
                                clearRecents(userId);
                                setRecentPosts([]);
                            }
                        }}
                        disabled={!userId || loading}
                    >
                        Clear
                    </Button>
                </div>

                {/* List of Recent Cards */}
                <div className="flex flex-col gap-2 items-center overflow-y-auto max-h-[calc(100vh-180px)] w-full">
                    {userId && recentPosts.length === 0 && !loading && (
                        <p className="text-sm text-gray-500">No recent views</p>
                    )}
                    {recentPosts.map((post) => (
                        <RecentCard
                            key={post.post_uuid}
                            avatar={post.author.pfp_url}
                            username={post.author.display_name ?? post.author.username}
                            timeAgo={timeAgo(post.created_at)}
                            caption={post.caption}
                            postImage={post.media[0]?.url || null}
                            likes={0}
                            onClick={() => {
                                if (userId) {
                                    addRecentPost(userId, post);
                                }
                                navigate(`/home/${post.author.username}/${post.post_uuid}`, {
                                    state: { background: location, post },
                                });
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
