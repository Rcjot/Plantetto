import useFetchPublishedGuides from "@/features/guides/hooks/useFetchPublishedGuides";
import { Link } from "react-router-dom";
import PublishedGuideCard from "@/features/guides/PublishedGuideCard";
import FilterScroll from "@/features/garden/FilterScroll";

function Guides() {
    const {
        guides,
        page,
        setPage,
        selectedCategory,
        setSelectedCategory,
        search,
        setSearch,
        setCategoryMap,
    } = useFetchPublishedGuides();

    if (guides === null) return <div>loading...</div>;

    return (
        <div className="myEditor flex flex-col items-center gap-7 p-3 sm:p-10">
            <div className="flex w-full justify-between">
                <div className=" sm:max-w-md">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-full bg-white border-gray-200"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <Link to="/guides/board" className="btn btn-primary self-end">
                    board
                </Link>
            </div>
            <div className="w-full">
                <FilterScroll
                    setPage={setPage}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setCategoryMap={setCategoryMap}
                />
            </div>

            <div className="flex flex-wrap gap-3">
                {guides.length !== 0 ? (
                    guides.map((boardCard) => {
                        return (
                            <PublishedGuideCard
                                key={boardCard.uuid}
                                guideCard={boardCard}
                            />
                        );
                    })
                ) : (
                    <div>no guides published yet to the community...</div>
                )}
            </div>
        </div>
    );
}

export default Guides;
