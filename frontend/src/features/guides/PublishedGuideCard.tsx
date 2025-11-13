import { Link } from "react-router-dom";
import type { GuideType } from "./guideTypes";
import defaultPlantPic from "@/assets/plant_placeholder.png";

interface PublishedGuideCardPropsType {
    guideCard: GuideType;
}

function PublishedGuideCard({ guideCard }: PublishedGuideCardPropsType) {
    return (
        <>
            <Link
                className="card bg-base-100 w-fit shadow-sm p-6"
                to={`/guides/${guideCard.uuid}`}
            >
                <div className="flex gap-3 max-w-100 ">
                    {
                        <div className="h-full w-25">
                            <img
                                className="h-full w-full object-scale-down"
                                src={guideCard.thumbnail ?? defaultPlantPic}
                                alt=""
                            />
                        </div>
                    }
                    <div>
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
                        <p>
                            {guideCard.author.display_name ??
                                guideCard.author.username}
                        </p>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default PublishedGuideCard;
