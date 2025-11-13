import { Link, useNavigate } from "react-router-dom";
import type { GuideType } from "./guideTypes";
import defaultPlantPic from "@/assets/plant_placeholder.png";
import ProfilePicture from "@/components/ProfilePicture";
import dayjs from "dayjs";

interface PublishedGuideCardPropsType {
    guideCard: GuideType;
}

function PublishedGuideCard({ guideCard }: PublishedGuideCardPropsType) {
    const navigate = useNavigate();

    const maxLength = 55;
    const isTruncated = guideCard.title.length > maxLength;
    const displayTitle =
        guideCard.title.slice(0, maxLength) + (isTruncated ? " ..." : "");

    return (
        <>
            <button
                className="card bg-base-100 shadow-sm overflow-hidden h-50 cursor-pointer"
                onClick={() => navigate(`/guides/${guideCard.uuid}`)}
            >
                <div className="flex gap-3 min-w-100 max-w-100">
                    <div className="h-full">
                        <img
                            className="h-50 object-cover hover:scale-105 transition-transform duration-300"
                            src={guideCard.thumbnail ?? defaultPlantPic}
                            alt="guide thumbnail"
                        />
                    </div>
                    <div className="flex flex-col text-start p-3 w-full">
                        <h1 className="font-bold wrap-anywhere">
                            {displayTitle}
                        </h1>

                        <p>
                            {guideCard.plant_type
                                ? guideCard.plant_type.plant_name
                                : "General"}
                        </p>

                        <div className="mt-auto flex items-center gap-3">
                            <p className="mr-auto text-sm mt-auto">
                                published <br />
                                {dayjs(guideCard.published_date).format(
                                    "MMM D, YYYY"
                                )}
                            </p>
                            <Link
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
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </>
    );
}

export default PublishedGuideCard;
