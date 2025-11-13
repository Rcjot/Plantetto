import type { GuideType } from "../guideTypes";
import { useNavigate } from "react-router-dom";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import guidesApi from "@/api/guidesApi";
import defaultPlantPic from "@/assets/plant_placeholder.png";
import dayjs from "dayjs";
import timeAgo from "@/lib/timeAgo";
// import ProfilePicture from "@/components/ProfilePicture";

interface GuideCardPropsType {
    guideCard: GuideType;
    refetch: () => void;
    refetchDelete: () => void;
}

function GuideCard({ guideCard, refetch, refetchDelete }: GuideCardPropsType) {
    const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

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
            refetchDelete();
        }
        setDeleteLoading(false);
    }

    function renderOptions() {
        return (
            <>
                <div
                    className="ml-auto dropdown dropdown-end sm:dropdown-start"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <div tabIndex={0} role="button" className="cursor-pointer">
                        <MoreHorizontalIcon className="size-7 self-end" />
                    </div>

                    <ul
                        tabIndex={-1}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-[-20px]"
                    >
                        <li>
                            <button
                                className="text-neutral-800 hover:bg-primary hover:text-neutral-100"
                                onClick={(e) => {
                                    navigate(`/guides/${guideCard.uuid}`, {
                                        state: { from: "board" },
                                    });
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                preview
                            </button>
                        </li>
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
            </>
        );
    }
    const maxLength = 30;
    const isTruncated = guideCard.title.length > maxLength;
    const displayTitle =
        guideCard.title.slice(0, maxLength) + (isTruncated ? " ..." : "");

    return (
        <>
            <div
                className="card bg-base-100 shadow-sm h-50 cursor-pointer"
                onClick={() => navigate(`/guides/${guideCard.uuid}/edit`)}
            >
                <div className="flex gap-3 w-full sm:min-w-100 max-w-100">
                    <div className="h-full flex-1 rounded-tl-lg rounded-bl-lg overflow-hidden">
                        <img
                            className="h-50 object-cover hover:scale-105 transition-transform duration-300"
                            src={guideCard.thumbnail ?? defaultPlantPic}
                            alt="guide thumbnail"
                        />
                    </div>
                    <div className="flex flex-col flex-2 text-start p-3 w-full">
                        <div className="flex gap-3">
                            <button className="text-start cursor-pointer">
                                <h1 className="font-bold wrap-anywhere">
                                    {displayTitle}
                                </h1>
                            </button>

                            {renderOptions()}
                        </div>

                        <p>
                            {guideCard.plant_type
                                ? guideCard.plant_type.plant_name
                                : "General"}
                        </p>

                        <div className="mt-auto flex items-center gap-3">
                            <p className="mr-auto text-xs mt-auto">
                                modified
                                <br />
                                {timeAgo(guideCard.last_edit_date)}
                                <br />
                                created
                                <br />
                                {dayjs(guideCard.created_at).format(
                                    "MMM D, YYYY"
                                )}
                            </p>
                            {/* <Link
                                to={`/${guideCard.author.username}`}
                                className="h-fit w-fit"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ProfilePicture
                                    src={guideCard.author.pfp_url}
                                />
                            </Link>

                            <div>
                                <Link
                                    to={`/${guideCard.author.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-fit w-fit"
                                >
                                    <span className="font-[1000] h-fit hover:underline cursor-pointer">
                                        {guideCard.author.display_name ??
                                            guideCard.author.username}
                                    </span>
                                </Link>
                                <Link
                                    to={`/${guideCard.author.username}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="h-fit w-fit"
                                >
                                    <p className="text-[#525252] hover:underline cursor-pointer">
                                        @{guideCard.author.username}
                                    </p>
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
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
