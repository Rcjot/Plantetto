import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ProfilePicture from "@/components/ProfilePicture";
import { useAuthContext } from "../auth/AuthContext";
import globeIcon from "@/assets/icons/globe.svg";
import lockIcon from "@/assets/icons/lock.svg";
import { useState, useEffect } from "react";
import EditPostForm from "./EditPostForm";
import { usePostContext } from "./context/PostContext";

function EditPostDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const { auth } = useAuthContext()!;
    const { post } = usePostContext()!;
    const [selectValue, setSelectValue] = useState<
        "everyone" | "private" | "for_me"
    >("everyone");

    useEffect(() => {
        if (post) {
            setSelectValue(
                post.visibility as "everyone" | "private" | "for_me"
            );
        }
    }, [post]);

    if (!post) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] bg-base-100 no-propagate">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Edit your post
                    </DialogTitle>
                    <DialogDescription className="text-center hidden">
                        edit your post
                    </DialogDescription>
                    <div className="flex gap-3">
                        <ProfilePicture />
                        <div className="flex flex-col">
                            <h1 className="font-bold text-start">
                                {auth.user?.display_name ?? auth.user?.username}
                            </h1>
                            <div className="flex items-center gap-1">
                                <img
                                    src={
                                        selectValue === "everyone"
                                            ? globeIcon
                                            : lockIcon
                                    }
                                    className="w-4 h-4 left-20 absolute z-20"
                                    alt="visibility"
                                />
                                <select
                                    className="select appearance-none select-ghost w-fit h-fit pl-5 focus:outline-none focus:ring-1"
                                    value={selectValue}
                                    onChange={(e) => {
                                        setSelectValue(
                                            e.target.value as
                                                | "everyone"
                                                | "private"
                                                | "for_me"
                                        );
                                    }}
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="private">Private</option>
                                    <option value="for_me">For me</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <EditPostForm selectValue={selectValue} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default EditPostDialog;
