import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import profileApi from "@/api/profileApi";
import followApi from "@/api/followApi";
import type { UserType } from "@/features/auth/authTypes";
import { DialogDemo } from "@/features/profile/EditProfileCard";
import { useAuthContext } from "@/features/auth/AuthContext";
import ProfilePicture from "@/components/ProfilePicture";

function Profile() {
    const [user, setUser] = useState<UserType | "loading" | null>("loading");
    const [isFollowing, setIsFollowing] = useState(false);
    const [followCounts, setFollowCounts] = useState({
        followers_count: 0,
        following_count: 0,
    });
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const { username } = useParams<string>();
    const { auth } = useAuthContext()!;

    const fetchProfile = useCallback(async () => {
        if (username) {
            if (username === auth.user?.username) {
                setUser(auth.user);
                return;
            }
            try {
                const res = await profileApi.fetchProfileDetails(username);
                setUser(res.user);
            } catch {
                setUser(null);
            }
        }
    }, [username, auth.user]);

    const fetchFollowStatus = useCallback(async () => {
        if (username && auth.user && username !== auth.user.username) {
            const { ok, isFollowing } =
                await followApi.checkFollowStatus(username);
            if (ok) {
                setIsFollowing(isFollowing);
            }
        }
    }, [username, auth.user]);

    const fetchFollowCounts = useCallback(async () => {
        if (username) {
            const { ok, counts } = await followApi.getFollowCounts(username);
            if (ok) {
                setFollowCounts(counts);
            }
        }
    }, [username]);

    useEffect(() => {
        if (!username) return;
        fetchProfile();
    }, [username, fetchProfile]);

    useEffect(() => {
        if (!username || !auth.user) return;

        if (username !== auth.user.username) {
            fetchFollowStatus();
        }
        fetchFollowCounts();
    }, [username, auth.user, fetchFollowStatus, fetchFollowCounts]);

    const handleFollowToggle = async () => {
        if (!username || isFollowLoading) return;

        setIsFollowLoading(true);

        if (isFollowing) {
            const { ok } = await followApi.unfollowUser(username);
            if (ok) {
                setIsFollowing(false);
                setFollowCounts((prev) => ({
                    ...prev,
                    followers_count: Math.max(0, prev.followers_count - 1),
                }));
            }
        } else {
            const { ok } = await followApi.followUser(username);
            if (ok) {
                setIsFollowing(true);
                setFollowCounts((prev) => ({
                    ...prev,
                    followers_count: prev.followers_count + 1,
                }));
            }
        }

        setIsFollowLoading(false);
    };

    if (user === "loading") return <div className="p-10">Loading...</div>;
    if (!user) return <div className="p-10">User not found.</div>;

    const isOwnProfile = auth.user && user.username === auth.user.username;

    return (
        <div className="bg-base-200 h-screen overflow-y-auto">
            <div className="bg-base-100">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            {/* pfp */}
                            <div className="avatar">
                                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <ProfilePicture
                                        src={user.pfp_url}
                                        size="normal"
                                    />
                                </div>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-base-content">
                                    {user.display_name || user.username}
                                </h1>
                                <p className="text-base-content/70">
                                    @{user.username}
                                </p>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className="text-base-content/70">
                                        <span className="font-bold text-base-content">
                                            {followCounts.followers_count}
                                        </span>{" "}
                                        Followers
                                    </span>
                                    <span className="text-base-content/70">
                                        <span className="font-bold text-base-content">
                                            {followCounts.following_count}
                                        </span>{" "}
                                        Following
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isOwnProfile ? (
                            <DialogDemo onSaved={fetchProfile} />
                        ) : (
                            <button
                                className={`btn ${isFollowing ? "btn-primary" : "btn-primary"}`}
                                onClick={handleFollowToggle}
                                disabled={isFollowLoading}
                            >
                                {isFollowLoading
                                    ? "Loading..."
                                    : isFollowing
                                      ? "Unfollow"
                                      : "Follow"}
                            </button>
                        )}
                    </div>
                    <div className="bg-base-200 border border-base-300 rounded-lg p-4 h-32 flex items-center justify-center">
                        <p className="text-base-content/40">Coming soon...</p>
                    </div>
                </div>
            </div>
            {/* nav tab*/}
            <div className="bg-base-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-base-300 text-neutral-100 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-3">
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral/30">
                                Posts
                            </button>
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral/30">
                                Plants
                            </button>
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral/30">
                                Guides
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* feed container (not my problem for now), maybe use useState to change content*/}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-base-100 rounded-lg border border-base-300 p-6 min-h-96 flex items-center justify-center">
                    <p className="text-base-content/40">Coming soon...</p>
                </div>
            </div>
            {/* temporary scroll fix (if removed, when you scroll down, there is no extra space making it look weird) */}
            <div className="h-16"></div>
        </div>
    );
}

export default Profile;
