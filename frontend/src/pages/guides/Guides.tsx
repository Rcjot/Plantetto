import useFetchPublishedGuides from "@/features/guides/hooks/useFetchPublishedGuides";
import { Link } from "react-router-dom";
import PublishedGuideCard from "@/features/guides/PublishedGuideCard";

function Guides() {
    const guides = useFetchPublishedGuides();

    if (guides === null) return <div>loading...</div>;
    if (guides.length == 0)
        return <div>no guides published yet to the community...</div>;

    return (
        <div className="myEditor flex flex-col items-center gap-7 p-3 sm:p-10">
            <Link to="/guides/board" className="btn btn-primary">
                board
            </Link>
            <div className="flex flex-wrap gap-3">
                {guides.map((boardCard) => {
                    return (
                        <PublishedGuideCard
                            key={boardCard.uuid}
                            guideCard={boardCard}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Guides;
