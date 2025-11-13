import { Link } from "react-router-dom";
import type { GuideType } from "./guideTypes";

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
        </>
    );
}

export default PublishedGuideCard;
