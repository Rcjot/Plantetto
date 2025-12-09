import { useState, useEffect } from "react";
import GardenCard from "@/features/garden/GardenCard";
import GardenCard_Details from "@/features/garden/GardenCard_Details.tsx";
import plantsApi from "@/api/plantsApi";
import type { PlantType, PlanttypeType } from "@/features/garden/gardenTypes";
import type { MetaDataType } from "@/api/plantsApi";
import loading_gif from "@/assets/loading_gif.gif";
import FilterScroll from "@/features/garden/FilterScroll.tsx";
import { useParams } from "react-router-dom";

function UsersGardenSection() {
    const { username } = useParams();
    const [plants, setPlants] = useState<PlantType[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [plantTypes, setPlantTypes] = useState<PlanttypeType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryMap, setCategoryMap] = useState<
        Record<string, number | undefined>
    >({});
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<MetaDataType | null>(null);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        async function loadPlantTypes() {
            const res = await plantsApi.fetchPlantTypes();
            if (res.ok && res.plant_types) setPlantTypes(res.plant_types);
        }
        loadPlantTypes();
    }, []);

    useEffect(() => {
        async function loadPlants() {
            if (!username) return;
            setLoading(true);
            // const categoryMap: Record<string, number | undefined> = {};
            // plantTypes.forEach((pt) => (categoryMap[pt.plant_name] = pt.id));
            // categoryMap["All"] = undefined;

            const plant_type_id = categoryMap[selectedCategory];

            const res = await plantsApi.fetchPlantsOfUser(
                username,
                search,
                plant_type_id ?? undefined,
                page
            );

            if (res.ok && res.plants) {
                setPlants(res.plants);
                const meta_data: MetaDataType = res.meta_data;

                let safePage = page;
                if (page > meta_data.max_page) safePage = meta_data.max_page;
                if (page < 1) safePage = 1;
                if (res.plants.length > 0 && page !== safePage) {
                    setPage(safePage);
                } else if (res.plants.length > 0 && page === safePage) {
                    setPlants(res.plants);
                }

                setMeta(meta_data);
            } else {
                setPlants([]);
                setMeta(null);
                if (page !== 1) setPage(1);
            }

            setLoading(false);
        }

        loadPlants();
    }, [
        username,
        selectedCategory,
        search,
        page,
        reload,
        plantTypes,
        categoryMap,
    ]);

    const handleCardClick = (plant: PlantType) => {
        setSelectedPlant(plant);
        setOpen(true);
    };

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

    return (
        <div className="bg-base-200 pr-1">
            {/* top controls */}
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
                    <div className="w-full sm:max-w-md">
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
                    <FilterScroll
                        setPage={setPage}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        setCategoryMap={setCategoryMap}
                    />
                </div>
            </div>

            {/* garden grid */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <img
                            src={loading_gif}
                            alt="Loading..."
                            className="h-16 w-16"
                        />
                    </div>
                ) : plants.length === 0 ? (
                    <p className="text-center text-neutral-400">
                        No plants yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {plants.map((plant) => (
                            <GardenCard
                                key={plant.plant_uuid}
                                image={plant.picture_url}
                                title={plant.nickname}
                                onClick={() => handleCardClick(plant)}
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

            {selectedPlant && (
                <GardenCard_Details
                    open={open}
                    onOpenChange={setOpen}
                    plant={selectedPlant}
                    onUpdated={() => {
                        setPage(1);
                        setReload((r) => r + 1);
                    }}
                />
            )}

            <div className="h-16" />
        </div>
    );
}

export default UsersGardenSection;
