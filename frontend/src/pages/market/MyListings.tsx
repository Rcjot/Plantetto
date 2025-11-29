import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarketCard from "@/features/market/MarketCard";
import CreateListingModal from "@/features/market/CreateListingModal";
import marketApi from "@/api/marketApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import type { MetaDataType } from "@/api/plantsApi";
import FilterScroll from "@/features/garden/FilterScroll";
import loading_gif from "@/assets/loading_gif.gif";
import type { MarketItemType } from "@/features/market/marketTypes";

function MyListings() {
    const navigate = useNavigate();
    const { auth } = useAuthContext()!;
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState<MarketItemType[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryMap, setCategoryMap] = useState<
        Record<string, number | undefined>
    >({});
    const [sort, setSort] = useState<string>("recent");
    const [status, setStatus] = useState<string>("all");
    const [meta, setMeta] = useState<MetaDataType | null>(null);

    useEffect(() => {
        const fetchListings = async () => {
            if (!auth.user?.username) return;

            setLoading(true);
            const plant_type_id = categoryMap[selectedCategory];

            const res = await marketApi.getListing(
                auth.user.username,
                search,
                plant_type_id,
                page,
                sort,
                status
            );

            if (res.ok && res.board) {
                setListings(res.board);
                setMeta(res.meta_data);
            } else {
                setListings([]);
                setMeta(null);
            }

            setLoading(false);
        };

        fetchListings();
    }, [auth.user, search, page, selectedCategory, categoryMap, sort, status]);

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

    const handleListingClick = (item: MarketItemType) => {
        navigate(`/mylistings/${item.uuid}`, {
            state: { item, isOwner: true },
        });
    };

    return (
        <div className="bg-base-200 pr-1">
            {/* top controls */}
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">My Listings</h1>
                        <div className="flex gap-2">
                            <button
                                className="btn btn-ghost"
                                onClick={() => navigate("/market")}
                            >
                                Browse Marketplace
                            </button>
                            <CreateListingModal
                                onSuccess={() => {
                                    setPage(1);
                                    // Trigger refetch by updating a state
                                    setSearch(search + " ");
                                    setSearch(search.trim());
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <input
                            type="text"
                            placeholder="Search your listings..."
                            className="input input-bordered flex-1 bg-white border-gray-200"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="select select-bordered bg-white"
                        >
                            <option value="recent">Recent</option>
                            <option value="oldest">Oldest</option>
                        </select>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="select select-bordered bg-white"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="sold">Sold</option>
                        </select>
                    </div>

                    <FilterScroll
                        setPage={setPage}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        setCategoryMap={setCategoryMap}
                    />
                </div>
            </div>

            {/* listings grid */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <img
                            src={loading_gif}
                            alt="Loading..."
                            className="h-16 w-16"
                        />
                    </div>
                ) : listings.length === 0 ? (
                    <p className="text-center text-neutral-400">
                        No listings yet. Create your first listing!
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {listings.map((item) => (
                            <MarketCard
                                key={item.uuid}
                                image={item.plant.picture_url}
                                title={item.plant.nickname}
                                price={item.price}
                                onClick={() => handleListingClick(item)}
                                showActions={true}
                            />
                        ))}
                    </div>
                )}

                {/* pagination */}
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

            <div className="h-16" />
        </div>
    );
}

export default MyListings;
