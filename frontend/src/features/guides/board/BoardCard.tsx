import type { GuideType } from "../guideTypes";
import { Link } from "react-router-dom";
import { MoreHorizontalIcon } from "lucide-react";
interface BoardCardPropsType {
    boardCard: GuideType;
}

function BoardCard({ boardCard }: BoardCardPropsType) {
    return (
        <Link
            className="card bg-base-100 w-fit shadow-sm p-6"
            to={`/guides/${boardCard.uuid}/edit`}
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
                        <button className="text-neutral-800 hover:bg-primary hover:text-neutral-100">
                            publish
                        </button>
                    </li>
                    <li>
                        <button className="text-warning-content hover:bg-warning/90 hover:text-neutral-100 hover:font-extrabold">
                            delete
                        </button>
                    </li>
                </ul>
            </div>
            <h1>{boardCard.title}</h1>
            <p>{boardCard.created_at}</p>
            <p>
                {boardCard.plant_type
                    ? boardCard.plant_type.plant_name
                    : "General"}
            </p>
            <p>{boardCard.guide_status}</p>
        </Link>
    );
}

export default BoardCard;
