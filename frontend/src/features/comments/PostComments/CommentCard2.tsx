// features/comments/CommentCard.tsx
import { useState, useRef } from "react";
import { Ellipsis, Trash2, Pencil, X, Check } from "lucide-react";
import { Link } from "react-router-dom"; // ADD THIS IMPORT
import type { CommentType } from "../commentTypes";
import type { UserType } from "@/features/auth/authTypes";
import defaultpfp from "@/assets/defaultpfp.png";

interface CommentCardProps {
    comment: CommentType;
    currentUser: UserType | null | undefined;
    postUuid: string;
    onEdit: (uuid: string, newContent: string) => Promise<boolean>;
    onDelete: (uuid: string) => Promise<boolean>;
}

export function CommentCard2({
    comment,
    currentUser,
    onEdit,
    onDelete,
}: CommentCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteModalRef = useRef<HTMLDialogElement>(null);

    const isOwner = currentUser?.id === comment.author.id;

    const formattedDate = new Date(comment.created_at).toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );

    const handleSaveEdit = async () => {
        if (editContent.trim() === comment.content) {
            setIsEditing(false);
            return;
        }
        setIsSaving(true);
        const success = await onEdit(comment.uuid, editContent);
        if (success) setIsEditing(false);
        setIsSaving(false);
    };

    // ADD: Function to open the delete modal
    const openDeleteModal = () => {
        setShowMenu(false); // Close the dropdown menu
        deleteModalRef.current?.showModal(); // Open DaisyUI modal
    };

    // ADD: Function to handle delete with loading state
    const handleDelete = async () => {
        setIsDeleting(true);
        await onDelete(comment.uuid);
        setIsDeleting(false);
        deleteModalRef.current?.close(); // Close modal after deletion
    };

    return (
        <div className="flex justify-center w-full">
            <div className="flex flex-col w-full">
                {/* Header Section */}
                <div className="flex flex-row gap-2 items-center relative">
                    {/* Avatar - Make it clickable */}
                    <Link
                        to={`/${comment.author.username}`}
                        className="h-fit w-fit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="avatar w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80">
                            <img
                                src={comment.author.pfp_url || defaultpfp}
                                onError={(e) =>
                                    (e.currentTarget.src = defaultpfp)
                                }
                                className="object-cover w-full h-full"
                                alt="avatar"
                            />
                        </div>
                    </Link>

                    {/* Username & Date - FIXED SECTION */}
                    <div className="flex-grow">
                        <div className="flex items-center gap-1">
                            <Link
                                to={`/${comment.author.username}`}
                                className="font-semibold text-sm hover:underline cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {comment.author.display_name ||
                                    comment.author.username}
                            </Link>
                            <span className="text-xs text-gray-500">
                                • {formattedDate}
                                {comment.last_edit_date != comment.created_at &&
                                    " (edited)"}
                            </span>
                        </div>
                    </div>

                    {/* Action Menu (Ellipsis) - Only show if Owner */}
                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <Ellipsis className="h-4 w-4 text-gray-500" />
                            </button>

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute right-0 top-6 z-10 bg-white shadow-lg border rounded-md py-1 min-w-[100px]">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <Pencil className="h-3 w-3" /> Edit
                                    </button>
                                    <button
                                        onClick={openDeleteModal}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 className="h-3 w-3" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="mt-2 pl-10">
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea
                                className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                            />
                            <div className="flex gap-2 text-xs">
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                    className="flex items-center gap-1 text-green-600 font-bold hover:underline"
                                >
                                    <Check className="h-3 w-3" /> Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditContent(comment.content);
                                    }}
                                    className="flex items-center gap-1 text-gray-500 hover:underline"
                                >
                                    <X className="h-3 w-3" /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-stone-700 text-sm whitespace-pre-wrap break-words">
                            {comment.content}
                        </div>
                    )}
                </div>

                {/* ADD: DaisyUI Delete Confirmation Modal */}
                <dialog ref={deleteModalRef} className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete Comment</h3>
                        <p className="py-4">
                            Are you sure you want to delete this comment? This
                            action cannot be undone.
                        </p>

                        <div className="modal-action">
                            {/* Cancel button */}
                            <form method="dialog">
                                <button className="btn" disabled={isDeleting}>
                                    Cancel
                                </button>
                            </form>

                            {/* Delete button */}
                            <button
                                onClick={handleDelete}
                                className="btn btn-error"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Comment"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Backdrop to close modal when clicking outside */}
                    <form method="dialog" className="modal-backdrop">
                        <button disabled={isDeleting}>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    );
}
