import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import postsApi from "@/api/postsApi";
import EditPostDialog from "./EditPostDialog";
import { usePostContext } from "./context/PostContext";
import moreHorizontalIcon from "@/assets/icons/more_horiz.svg";
import { useAuthContext } from "../auth/AuthContext";
import { notifyRecentsUpdated, removeRecentPost } from "@/features/recent/recentService";

function PostOptionsButton({
    setDeleted,
}: {
    setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { post, openEdit, setOpenEditCallback } = usePostContext()!;
    const { auth } = useAuthContext()!;
    const [openConfirm, setOpenConfirm] = useState(false);

    async function handleDeletePost() {
        const { ok } = await postsApi.deletePost(post.post_uuid);
        if (ok) {
            setDeleted(true);
            if (auth.user?.id) {
                removeRecentPost(auth.user.id, post.post_uuid);
            }
        }
    }

    return (
        <>
            <div
                className="ml-auto dropdown dropdown-end sm:dropdown-start"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div tabIndex={0} role="button" className="cursor-pointer">
                    <img src={moreHorizontalIcon} alt="post options" />
                </div>
                <ul
                    tabIndex={-1}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-[-20px]"
                >
                    <li>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenEditCallback(true);
                                if (auth.user?.id) {
                                    // trigger recent block refresh after potential edit
                                    notifyRecentsUpdated(auth.user.id);
                                }
                            }}
                        >
                            edit
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenConfirm(true);
                            }}
                        >
                            delete
                        </button>
                    </li>
                </ul>
            </div>
            <EditPostDialog open={openEdit} setOpen={setOpenEditCallback} />
            <ConfirmDialog
                open={openConfirm}
                setOpen={setOpenConfirm}
                onConfirm={handleDeletePost}
            />
        </>
    );
}

export default PostOptionsButton;