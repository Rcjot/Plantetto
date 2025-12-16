import { Heart, Edit2, Trash2, MoreVertical, X, Check } from "lucide-react";
import defaultpfp from "@/assets/defaultpfp.png";
import type { CommentType } from "../commentTypes";
import type { UserType } from "@/features/auth/authTypes";
import { useState, useRef, useEffect } from "react"; // ADD useRef import
import commentsGuidesApi from "@/api/commentsGuidesApi";
import likesApi from "@/api/likesApi";
import timeAgo from "@/lib/timeAgo";
import { Link } from "react-router-dom";

interface GuideCommentCardProps {
    comment: CommentType;
    currentUser: UserType | null | undefined;
    guideUuid: string;
    onEditSuccess?: () => void;
    onDeleteSuccess?: () => void;
}

export function GuideCommentCard({
    comment,
    currentUser,
    guideUuid,
    onEditSuccess,
    onDeleteSuccess,
}: GuideCommentCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showActions, setShowActions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [isLiked, setIsLiked] = useState(comment.liked);
    const [likeCount, setLikeCount] = useState(comment.like_count);

    // ADD: Reference to the modal for DaisyUI
    const deleteModalRef = useRef<HTMLDialogElement>(null);

    const [formattedDate, setFormattedDate] = useState<string>(() =>
        timeAgo(comment.created_at)
    );

    const isOwner = currentUser?.id === comment.author.id;

    useEffect(() => {
        const interval = setInterval(
            () => setFormattedDate(timeAgo(comment.created_at)),
            6000
        );
        return () => clearInterval(interval);
    }, [comment.created_at]);

    const handleEdit = async () => {
        if (!editContent.trim()) return;

        setIsSaving(true);
        const result = await commentsGuidesApi.patchContent(
            guideUuid,
            comment.uuid,
            editContent
        );

        if (result.ok) {
            setIsEditing(false);
            setShowActions(false);
            if (onEditSuccess) onEditSuccess();
        } else {
            console.error("Failed to edit comment:", result.errors);
        }
        setIsSaving(false);
    };

    // ADD: Function to open the delete modal
    const openDeleteModal = () => {
        setShowActions(false); // Close the dropdown menu
        deleteModalRef.current?.showModal(); // Open DaisyUI modal
    };

    // UPDATED: Function to handle delete with modal
    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await commentsGuidesApi.deleteComment(
            guideUuid,
            comment.uuid
        );

        if (result.ok) {
            if (onDeleteSuccess) onDeleteSuccess();
        } else {
            console.error("Failed to delete comment:", result.errors);
        }
        setIsDeleting(false);
        deleteModalRef.current?.close(); // Close modal after deletion
    };

    async function toggleLikeCommentGuide() {
        const { ok, action } = await likesApi.toggleLikeCommentGuide(
            comment.uuid
        );
        if (ok) {
            setIsLiked(action === "like");
            setLikeCount((prev) => {
                if (action === "like") {
                    return prev + 1;
                } else {
                    return prev - 1;
                }
            });
        }
    }
    return (
        <div className="flex flex-col mt-2">
            {/* Comment Card */}
            <div className="flex flex-col p-4 rounded-lg relative">
                {/* Header Section */}
                <div className="flex flex-row gap-3 items-center mb-3">
                    {/* Avatar */}
                    <Link
                        to={`/${comment.author.username}`}
                        className="avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                    >
                        <img
                            src={comment.author.pfp_url || defaultpfp}
                            onError={(e) => (e.currentTarget.src = defaultpfp)}
                            className="object-cover w-full h-full"
                            alt={`${comment.author.username}'s profile`}
                        />
                    </Link>

                    {/* Username & Date */}
                    <div className="flex flex-col flex-grow">
                        <div className="flex items-center gap-2">
                            <Link
                                to={`/${comment.author.username}`}
                                className="font-semibold text-sm hover:underline"
                            >
                                {comment.author.display_name ??
                                    comment.author.username}
                            </Link>
                        </div>
                        <span className="text-xs text-gray-500">
                            {formattedDate}
                            {comment.last_edit_date != comment.created_at &&
                                " (edited)"}
                        </span>
                    </div>

                    {/* Actions Menu */}
                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                onBlur={() =>
                                    setTimeout(() => setShowActions(false), 200)
                                }
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>

                            {showActions && (
                                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                                    <button
                                        onClick={() => {
                                            setShowActions(false);
                                            setIsEditing(true);
                                        }}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <Edit2 className="h-3 w-3" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={openDeleteModal}
                                        disabled={isDeleting}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Comment Content or Edit Form */}
                <div className="ml-13">
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                disabled={isSaving}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditContent(comment.content);
                                        setShowActions(false);
                                    }}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEdit}
                                    disabled={isSaving || !editContent.trim()}
                                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-1 transition-colors"
                                >
                                    <Check className="h-3 w-3" />
                                    {isSaving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-stone-700 text-sm whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => toggleLikeCommentGuide()}
                            className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Heart
                                className={`h-5 w-5 text-gray-500 hover:text-red-500 ${isLiked && "fill-accent text-red-100"}`}
                            />
                        </button>
                        <div className="min-w-[20px] text-center">
                            <span className="text-sm font-medium text-gray-500">
                                {likeCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-2">
                    <hr className="border-t border-neutral border-t-1" />
                </div>
            </div>

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
    );
}
