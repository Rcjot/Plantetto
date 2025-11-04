import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SetProfile from "@/features/profile/SetProfile";
import type { SetProfileRef } from "@/features/profile/SetProfile";
import { useAuthContext } from "@/features/auth/AuthContext";
import { useRef, useState, useEffect } from "react";
import profileApi from "@/api/profileApi";

export function DialogDemo({ onSaved }: { onSaved?: () => void }) {
    const { auth, fetchCredentials } = useAuthContext()!;
    const setProfileRef = useRef<SetProfileRef>(null);
    const [displayName, setDisplayName] = useState(
        auth.user?.display_name ?? ""
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateDisplayName = (value: string) => {
        const regex = /^[A-Za-z0-9_]+$/;
        if (value.trim() === "") return "Display name cannot be empty.";
        if (!regex.test(value))
            return "Only letters, numbers, and underscores (_) are allowed. No spaces or special characters.";
        return null;
    };

    function handleDisplayNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value.replace(/\s+/g, "");
        setDisplayName(value);
        setError(validateDisplayName(value));
    }

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (error) return;
        setIsSubmitting(true);

        try {
            const formData =
                (await setProfileRef.current?.getProfileData()) ||
                new FormData();

            if (displayName !== (auth.user?.display_name ?? "")) {
                formData.append("display_name", displayName);
            }

            if (Array.from(formData.entries()).length > 0) {
                const result = await profileApi.setProfile(formData);
                if (result.ok) {
                    await fetchCredentials();
                    if (onSaved) onSaved();
                    setOpen(false);
                }
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        setDisplayName(auth.user?.display_name ?? "");
        setError(null);
    }, [auth.user?.display_name]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-base-100 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSave}>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            You can update your profile picture or display name
                            here.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* pfp */}
                        <div className="flex justify-center">
                            <SetProfile ref={setProfileRef} />
                        </div>

                        {/* display name w/ inline validation */}
                        <div className="grid gap-2">
                            <Label htmlFor="display_name">Display Name</Label>
                            <Input
                                id="display_name"
                                name="display_name"
                                value={displayName}
                                onChange={handleDisplayNameChange}
                                placeholder="Enter your display name"
                                className={
                                    error
                                        ? "border-warning focus-visible:ring-warning"
                                        : ""
                                }
                            />
                            {error && (
                                <p className="text-sm text-warning mt-1">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !!error}
                        >
                            {isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
