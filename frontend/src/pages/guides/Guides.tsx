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
        meta,
        loading,
    } = useFetchPublishedGuides();

    const renderPageButtons = () => {
        if (!meta) return null;
        const pages = [];
        for (let i = 1; i <= meta.max_page; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`btn btn-sm ${
                        i === page
                            ? "bg-primary text-white hover:bg-primary"
                            : "btn-outline hover:bg-primary hover:text-white hover:border-transparent"
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    if (guides === null) return <div>loading...</div>;

    return (
        <div className="flex flex-col gap-7 p-3 sm:p-10">
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
            {!loading && meta && meta.max_page > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    <button
                        className="btn btn-sm btn-primary"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                        Prev
                    </button>

                    {renderPageButtons()}

                    <button
                        className="btn btn-sm btn-primary"
                        disabled={page >= meta.max_page}
                        onClick={() =>
                            setPage((p) => Math.min(p + 1, meta.max_page))
                        }
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Guides;
