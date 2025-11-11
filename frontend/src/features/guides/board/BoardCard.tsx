import type { GuideType } from "../guideTypes";
import { Link } from "react-router-dom";

interface BoardCardPropsType {
    boardCard: GuideType;
}

function BoardCard({ boardCard }: BoardCardPropsType) {
    return (
        <Link
            className="card bg-base-100 w-fit shadow-sm p-6"
            to={`/guides/${boardCard.uuid}/edit`}
        >
            <h1>{boardCard.title}</h1>
            <p>{boardCard.created_at}</p>
            <p>{boardCard.plant_type.plant_name}</p>
        </Link>
    );
}

export default BoardCard;
