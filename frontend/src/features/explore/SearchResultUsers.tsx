import { useState, useEffect, useRef } from "react";
import profileApi from "@/api/profileApi";
import followApi from "@/api/followApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import type { SearchedUserType } from "@/features/auth/authTypes";
import defaultpfp from "@/assets/defaultpfp.png";

interface Props {
    search: string;
}

export default function SearchResultsUsers({ search }: Props) {
    const [users, setUsers] = useState<SearchedUserType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const [followStates, setFollowStates] = useState<Record<string, boolean>>(
        {}
    );
    const [followLoadingStates, setFollowLoadingStates] = useState<
        Record<string, boolean>
    >({});

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { auth } = useAuthContext()!;

    useEffect(() => {
        async function fetchUsers() {
            if (!search.trim()) {
                setUsers([]);
                setNextCursor(null);
                setFollowStates({});
                setFollowLoadingStates({});
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const { users: resUsers, nextCursor: newCursor } =
                    await profileApi.exploreUsers(search);

                setUsers(resUsers);
                setNextCursor(newCursor);

                const newFollowStates: Record<string, boolean> = {};
                const newFollowLoading: Record<string, boolean> = {};
                resUsers.forEach((u) => {
                    newFollowStates[u.username] = u.is_following;
                    newFollowLoading[u.username] = false;
                });
                setFollowStates(newFollowStates);
                setFollowLoadingStates(newFollowLoading);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [search]);

    useEffect(() => {
        if (!loadMoreRef.current) return;
        if (!nextCursor) return;

        observerRef.current = new IntersectionObserver(
            async ([entry]) => {
                if (entry.isIntersecting && !loading) {
                    setLoading(true);
                    try {
                        const { users: resUsers, nextCursor: newCursor } =
                            await profileApi.exploreUsers(search, nextCursor);
                        setUsers((prev) => {
                            const existingUsernames = new Set(
                                prev.map((u) => u.username)
                            );
                            const newUnique = resUsers.filter(
                                (u) => !existingUsernames.has(u.username)
                            );
                            return [...prev, ...newUnique];
                        });
                        setNextCursor(newCursor);

                        setFollowStates((prev) => {
                            const copy = { ...prev };
                            resUsers.forEach(
                                (u) => (copy[u.username] = u.is_following)
                            );
                            return copy;
                        });
                        setFollowLoadingStates((prev) => {
                            const copy = { ...prev };
                            resUsers.forEach((u) => (copy[u.username] = false));
                            return copy;
                        });
                    } catch (err) {
                        console.error("Error fetching more users:", err);
                        setError("Failed to load more users");
                    } finally {
                        setLoading(false);
                    }
                }
            },
            { rootMargin: "200px" }
        );

        observerRef.current.observe(loadMoreRef.current);

        return () => observerRef.current?.disconnect();
    }, [nextCursor, loading, search]);

    const handleFollowToggle = async (username: string) => {
        if (followLoadingStates[username]) return;

        setFollowLoadingStates((prev) => ({ ...prev, [username]: true }));

        try {
            if (followStates[username]) {
                const { ok } = await followApi.unfollowUser(username);
                if (ok)
                    setFollowStates((prev) => ({ ...prev, [username]: false }));
            } else {
                const { ok } = await followApi.followUser(username);
                if (ok)
                    setFollowStates((prev) => ({ ...prev, [username]: true }));
            }
        } catch (err) {
            console.error("Follow toggle failed:", err);
        } finally {
            setFollowLoadingStates((prev) => ({ ...prev, [username]: false }));
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="py-8 text-center text-neutral-500">
                Loading users...
            </div>
        );
    }

    if (error && users.length === 0) {
        return <div className="py-8 text-center text-error">{error}</div>;
    }

    if (users.length === 0) {
        return (
            <div className="py-8 text-center text-neutral-500">
                No users found
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {users.map((user) => {
                const isOwnUser = auth.user?.username === user.username;
                const isFollowing = followStates[user.username];
                const isFollowLoading = followLoadingStates[user.username];

                return (
                    <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors"
                    >
                        <a
                            href={`/${user.username}`}
                            className="flex items-center gap-3 flex-1"
                        >
                            <img
                                src={user.pfp_url || defaultpfp}
                                alt={user.username}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {user.display_name || user.username}
                                </span>
                                <span className="text-sm text-neutral-500">
                                    @{user.username}
                                </span>
                            </div>
                        </a>

                        {!isOwnUser && (
                            <button
                                className={`btn btn-sm ${
                                    isFollowing ? "btn-primary" : "btn-primary"
                                }`}
                                onClick={() =>
                                    handleFollowToggle(user.username)
                                }
                                disabled={isFollowLoading}
                            >
                                {isFollowLoading
                                    ? "Loading..."
                                    : isFollowing
                                      ? "Following"
                                      : "Follow"}
                            </button>
                        )}
                    </div>
                );
            })}
            {nextCursor && <div ref={loadMoreRef} />}
            {loading && users.length > 0 && (
                <div className="py-4 text-center text-neutral-500">
                    Loading more users...
                </div>
            )}
        </div>
    );
}
