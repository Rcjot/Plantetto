import ProfilePicture from "@/components/ProfilePicture";
import CreatePostDialog from "./CreatePostDialog";
import { useRef } from "react";
import { DialogTrigger } from "@/components/ui/dialog";

function CreatePost() {
    const dialogTriggerRef = useRef<HTMLButtonElement>(null);
    return (
        <>
            <div className="card w-70 sm:w-96 bg-base-100 card-md shadow-lg p-4 flex flex-col gap-2">
                <div className="flex gap-1">
                    <ProfilePicture />
                    <button
                        className="border-b border-base-300 cursor-pointer flex-1 text-start"
                        onClick={() => dialogTriggerRef.current?.click()}
                    >
                        <p className="hover:bg-base-300 p-1 rounded-full px-3">
                            What's growing today?
                        </p>
                    </button>
                </div>
                <button
                    className="btn btn-primary w-fit h-fit px-4 py-1 self-end"
                    onClick={() => dialogTriggerRef.current?.click()}
                >
                    Post
                </button>
            </div>
            <CreatePostDialog>
                <DialogTrigger ref={dialogTriggerRef}></DialogTrigger>
            </CreatePostDialog>
        </>
    );
}

export default CreatePost;
