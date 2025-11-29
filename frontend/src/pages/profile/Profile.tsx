import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import profileApi from "@/api/profileApi";
import followApi from "@/api/followApi";
import type { UserType } from "@/features/auth/authTypes";
import { DialogDemo } from "@/features/profile/EditProfileCard";
import { useAuthContext } from "@/features/auth/AuthContext";
import ProfilePicture from "@/components/ProfilePicture";
import { FollowersDialog } from "@/features/follow/FollowersDialog";
import { FollowingDialog } from "@/features/follow/FollowingDialog";
import chat_icon from "@/assets/icons/chat.svg";
import { followNotify } from "@/lib/socket";
import { BellRingIcon } from "lucide-react";

function Profile() {
    const [user, setUser] = useState<UserType | "loading" | null>("loading");
    const [isFollowing, setIsFollowing] = useState(false);
    const [followCounts, setFollowCounts] = useState({
        followers_count: 0,
        following_count: 0,
    });
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
    const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
    const { username } = useParams<string>();
    const { auth } = useAuthContext()!;
    const [notifStatus, setNotifStatus] = useState<{
        notify_post: boolean;
        notify_guide: boolean;
    } | null>(null);

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
        if (
            !username ||
            isFollowLoading ||
            !auth.user ||
            !user ||
            user === "loading"
        )
            return;

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
                followNotify(auth.user, user);
            }
        }

        setIsFollowLoading(false);
    };

    const fetchNotifStatus = useCallback(async () => {
        if (
            !username ||
            isFollowLoading ||
            !auth.user ||
            !user ||
            user === "loading"
        )
            return;
        const { notificationStatus } = await followApi.getNotifStatus(username);
        setNotifStatus(notificationStatus);
    }, [auth, username, isFollowLoading, user]);

    useEffect(() => {
        fetchNotifStatus();
    }, [fetchNotifStatus]);

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
                                    {/* followers */}
                                    <button
                                        onClick={() =>
                                            setFollowersDialogOpen(true)
                                        }
                                        className="text-base-content/70 hover:underline cursor-pointer"
                                    >
                                        <span className="font-bold text-base-content">
                                            {followCounts.followers_count}
                                        </span>{" "}
                                        Followers
                                    </button>

                                    {/* following */}
                                    {isOwnProfile ? (
                                        <button
                                            onClick={() =>
                                                setFollowingDialogOpen(true)
                                            }
                                            className="text-base-content/70 hover:underline cursor-pointer"
                                        >
                                            <span className="font-bold text-base-content">
                                                {followCounts.following_count}
                                            </span>{" "}
                                            Following
                                        </button>
                                    ) : (
                                        <span className="text-base-content/70 cursor-default select-none">
                                            <span className="font-bold text-base-content">
                                                {followCounts.following_count}
                                            </span>{" "}
                                            Following
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isOwnProfile ? (
                            <DialogDemo onSaved={fetchProfile} />
                        ) : (
                            <div className="flex gap-4 items-center">
                                <button
                                    className={`btn ${
                                        isFollowing
                                            ? "btn-primary"
                                            : "btn-primary"
                                    }`}
                                    onClick={handleFollowToggle}
                                    disabled={isFollowLoading}
                                >
                                    {isFollowLoading
                                        ? "Loading..."
                                        : isFollowing
                                          ? "Unfollow"
                                          : "Follow"}
                                </button>
                                <button
                                    onClick={() => {
                                        const event = new CustomEvent(
                                            "openChat",
                                            { detail: { user: user } }
                                        );
                                        window.dispatchEvent(event);
                                    }}
                                >
                                    <img
                                        tabIndex={0}
                                        role="button"
                                        src={chat_icon}
                                        alt="Chat"
                                        className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
                                    />
                                </button>
                                {notifStatus && (
                                    <div className="dropdown dropdown-left 2xl:dropdown-right">
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className="cursor-pointer"
                                        >
                                            <BellRingIcon />
                                        </div>
                                        <ul
                                            tabIndex={-1}
                                            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                                        >
                                            <li>
                                                <button
                                                    onClick={async () => {
                                                        await followApi.patchNotification(
                                                            user.username,
                                                            "post"
                                                        );
                                                        fetchNotifStatus();
                                                    }}
                                                >
                                                    {notifStatus.notify_post
                                                        ? "unnotify me for new posts"
                                                        : "notify me for new posts"}
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={async () => {
                                                        await followApi.patchNotification(
                                                            user.username,
                                                            "guide"
                                                        );
                                                        fetchNotifStatus();
                                                    }}
                                                >
                                                    {notifStatus.notify_guide
                                                        ? "unnotify me for new guides"
                                                        : "notify me for new guides"}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-base-200 border border-base-300 rounded-lg p-4 h-32 flex items-center justify-center">
                        <p className="text-base-content/40">Coming soon...</p>
                    </div>
                </div>
            </div>

            {/* nav tab */}
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

            {/* feed container */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-base-100 rounded-lg border border-base-300 p-6 min-h-96 flex items-center justify-center">
                    <p className="text-base-content/40">Coming soon...</p>
                </div>
            </div>

            <div className="h-16"></div>

            {/* follow dialogs */}
            <FollowersDialog
                open={followersDialogOpen}
                onOpenChange={setFollowersDialogOpen}
                username={username!}
            />
            <FollowingDialog
                open={followingDialogOpen}
                onOpenChange={setFollowingDialogOpen}
                username={username!}
            />
        </div>
    );
}

export default Profile;
