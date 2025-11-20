import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ProfilePicture from "@/components/ProfilePicture";
import { Link } from "react-router-dom";
import followApi from "@/api/followApi";
import type { UserType } from "@/features/auth/authTypes";

interface FollowersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    username: string;
}

export function FollowersDialog({
    open,
    onOpenChange,
    username,
}: FollowersDialogProps) {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return; // don't clear on close

        const fetchUsers = async () => {
            setLoading(true);
            const { ok, followers } = await followApi.getFollowers(username);
            if (ok) setUsers(followers);
            setLoading(false);
        };

        fetchUsers();
    }, [open, username]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="bg-base-100 flex flex-col"
                style={{
                    width: "30vw",
                    maxWidth: "30vw",
                    maxHeight: "50vh",
                }}
            >
                <DialogHeader>
                    <DialogTitle>Followers</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 pr-2">
                    {loading ? (
                        <div className="flex justify-center items-center py-6">
                            <p className="text-base-content/40">Loading...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex justify-center items-center py-6">
                            <p className="text-base-content/40">
                                No followers yet
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <Link
                                    key={user.id}
                                    to={`/${user.username}`}
                                    onClick={(e) => {
                                        e.preventDefault(); // stop instant navigation
                                        onOpenChange(false); // close dialog immediately
                                        setTimeout(() => {
                                            window.location.href = `/${user.username}`; // navigate after closing
                                        }, 300); // 300ms gives time for the dialog to close
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                                >
                                    <ProfilePicture src={user.pfp_url} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-base-content truncate">
                                            {user.display_name || user.username}
                                        </p>
                                        <p className="text-sm text-base-content/70 truncate">
                                            @{user.username}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
