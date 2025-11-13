import type { GuideType } from "../guideTypes";
import { Link } from "react-router-dom";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import guidesApi from "@/api/guidesApi";

interface GuideCardPropsType {
    guideCard: GuideType;
    refetch: () => void;
}

function GuideCard({ guideCard, refetch }: GuideCardPropsType) {
    const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    async function handlePublishConfirm() {
        const newStatus =
            guideCard.guide_status === "draft" ? "published" : "draft";
        setPublishLoading(true);
        const { ok } = await guidesApi.patchStatusGuide(
            guideCard.uuid,
            newStatus
        );
        if (ok) {
            refetch();
        }
        setPublishLoading(false);
    }

    async function handleDeleteConfirm() {
        setDeleteLoading(true);
        const { ok } = await guidesApi.deleteGuide(guideCard.uuid);
        if (ok) {
            refetch();
        }
        setDeleteLoading(false);
    }

    return (
        <>
            <Link
                className="card bg-base-100 w-fit shadow-sm p-6"
                to={`/guides/${guideCard.uuid}/edit`}
            >
                <div
                    className="ml-auto dropdown dropdown-end sm:dropdown-start"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <div tabIndex={0} role="button" className="cursor-pointer">
                        <MoreHorizontalIcon className="size-4 self-end" />
                    </div>
                    <ul
                        tabIndex={-1}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-[-20px]"
                    >
                        <li>
                            <button
                                className="text-neutral-800 hover:bg-primary hover:text-neutral-100"
                                onClick={(e) => {
                                    setPublishConfirmOpen(true);
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                {guideCard.guide_status === "draft"
                                    ? "publish"
                                    : "unpublish"}
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-warning-content hover:bg-warning/90 hover:text-neutral-100 hover:font-extrabold"
                                onClick={(e) => {
                                    setDeleteConfirmOpen(true);
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                delete
                            </button>
                        </li>
                    </ul>
                </div>
                <h1>{guideCard.title}</h1>
                <p>created at : {guideCard.created_at}</p>
                <p>last edit : {guideCard.last_edit_date}</p>
                {guideCard.guide_status === "published" && (
                    <p>published date : {guideCard.published_date}</p>
                )}
                <p>
                    {guideCard.plant_type
                        ? guideCard.plant_type.plant_name
                        : "General"}
                </p>
                <p>{guideCard.guide_status}</p>
            </Link>
            <ConfirmDialog
                open={publishConfirmOpen}
                setOpen={setPublishConfirmOpen}
                onConfirm={handlePublishConfirm}
                loading={publishLoading}
                text={`Are you sure to ${guideCard.guide_status === "draft" ? "publish" : "unpublish"}?`}
            />
            <ConfirmDialog
                open={deleteConfirmOpen}
                setOpen={setDeleteConfirmOpen}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                text={"Are you sure to delete?"}
            />
        </>
    );
}

export default GuideCard;
