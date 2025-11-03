import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import profileApi from "@/api/profileApi";
import type { User } from "@/features/auth/authTypes";
import { DialogDemo } from "@/features/profile/EditProfileCard";

function Profile() {
    const [user, setUser] = useState<User | "loading" | null>("loading");
    const { username } = useParams<string>();

    useEffect(() => {
        const fetchProfile = async () => {
            if (username) {
                try {
                    const res = await profileApi.fetchProfileDetails(username);
                    setUser(res.user);
                } catch {
                    setUser(null);
                }
            }
        };
        fetchProfile();
    }, [username]);

    if (user === "loading") return <div className="p-10">Loading...</div>;
    if (!user) return <div className="p-10">User not found.</div>;

    const currentUserUsername = "tyrone_byrone";
    const isOwnProfile = user.username === currentUserUsername;
    return (
        <div className="bg-base-200 h-screen overflow-y-auto">
            <div className="bg-base-100">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            {user.pfp_url ? (
                                <div className="avatar">
                                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={user.pfp_url} alt="pfp" />
                                    </div>
                                </div>
                            ) : (
                                <div className="avatar placeholder">
                                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-neutral text-neutral-content flex items-center justify-center">
                                        <span className="text-xl">
                                            {user.username[0].toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div>
                                <h1 className="text-2xl font-bold text-base-content">
                                    {user.username}
                                </h1>
                                <p className="text-base-content/70">
                                    @{user.username}
                                </p>
                                <p className="text-sm text-base-content/60">
                                    2 followers 1 following
                                </p>
                            </div>
                        </div>

                        {isOwnProfile ? (
                            <DialogDemo />
                        ) : (
                            <button className="btn btn-sm btn-neutral">
                                Follow
                            </button>
                        )}
                    </div>

                    <div className="bg-base-200 border border-base-300 rounded-lg p-4 h-32 flex items-center justify-center">
                        <p className="text-base-content/40">
                            circle things container
                        </p>
                    </div>
                </div>
            </div>

            {/* nav tab*/}
            <div className="bg-base-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-success text-success-content rounded-lg overflow-hidden">
                        <div className="grid grid-cols-3">
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral">
                                Posts
                            </button>
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral">
                                Plants
                            </button>
                            <button className="py-3 text-center font-semibold transition-colors hover:bg-neutral">
                                Guides
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* feed container (not my problem for now), maybe use useState to change content*/}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-base-100 rounded-lg border border-base-300 p-6 min-h-96 flex items-center justify-center">
                    <p className="text-base-content/40">
                        feed blah blah lbla AAAAA
                    </p>
                </div>
            </div>
            {/* temporary scroll fix (if removed, when you scroll down, there is no extra space making it look weird) */}
            <div className="h-16"></div>
        </div>
    );
}

export default Profile;
