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
import { useState } from "react";
import CreatePostForm from "./CreatePostForm";

function CreatePostDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { auth } = useAuthContext()!;
    const [selectValue, setSelectValue] = useState<string>("everyone");
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] max-h-[95vh] overflow-y-auto bg-base-100">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Create new post
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Sprout a new post, greenify the feed!
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
                                        selectValue == "everyone"
                                            ? globeIcon
                                            : lockIcon
                                    }
                                    className="w-4 h-4  left-20 absolute z-20"
                                    alt="globe"
                                />
                                <select
                                    className="select appearance-none select-ghost w-fit h-fit pl-5 focus:outline-none focus:ring-1"
                                    value={selectValue}
                                    onChange={(e) => {
                                        setSelectValue(e.target.value);
                                    }}
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <CreatePostForm setOpen={setOpen} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CreatePostDialog;
