import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import profileApi from "@/api/profileApi";
import type { UserType } from "@/features/auth/authTypes";
import { DialogDemo } from "@/features/profile/EditProfileCard";
import { useAuthContext } from "@/features/auth/AuthContext";
import ProfilePicture from "@/components/ProfilePicture";

function Profile() {
    const [user, setUser] = useState<UserType | "loading" | null>("loading");
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

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

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
                            </div>
                        </div>

                        {isOwnProfile ? (
                            <DialogDemo onSaved={fetchProfile} />
                        ) : (
                            <button className="btn btn-sm btn-neutral">
                                Follow
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
                    <p className="text-base-content/40">Coming Soon...</p>
                </div>
            </div>
            {/* temporary scroll fix (if removed, when you scroll down, there is no extra space making it look weird) */}
            <div className="h-16"></div>
        </div>
    );
}

export default Profile;
