import { useState, useEffect, useRef } from "react";
import GardenCard from "../../features/garden/GardenCard.tsx";
import GardenAddPlant from "../../features/garden/GardenAddPlant.tsx";
import GardenCard_Details from "../../features/garden/GardenCard_Details.tsx";
import plantsApi from "@/api/plantsApi";
import type { PlantType, PlanttypeType } from "@/features/garden/gardenTypes";
import type { MetaDataType } from "@/api/plantsApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import loading_gif from "@/assets/loading_gif.gif";
import styles from "../../features/garden/filter_scroll.module.css";

function MyGarden() {
    const { auth } = useAuthContext()!;
    const [plants, setPlants] = useState<PlantType[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [plantTypes, setPlantTypes] = useState<PlanttypeType[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<MetaDataType | null>(null);
    const [reload, setReload] = useState(0);

    // Refs and scroll control
    const filterScrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const checkScrollPosition = () => {
        const container = filterScrollRef.current;
        if (!container) return;

        setCanScrollLeft(container.scrollLeft > 0);
        setCanScrollRight(
            container.scrollLeft <
                container.scrollWidth - container.clientWidth - 1
        );
    };

    const scroll = (direction: "left" | "right") => {
        const container = filterScrollRef.current;
        if (!container) return;

        const scrollAmount = 200;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const container = filterScrollRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            if (
                e.deltaY !== 0 &&
                container.scrollWidth > container.clientWidth
            ) {
                e.preventDefault();
                container.scrollLeft += e.deltaY;
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        const container = filterScrollRef.current;
        if (!container) return;

        setIsDragging(true);
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeft(container.scrollLeft);
        container.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const container = filterScrollRef.current;
        if (!container) return;

        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = x - startX;
        container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        const container = filterScrollRef.current;
        if (container) container.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            const container = filterScrollRef.current;
            if (container) container.style.cursor = "grab";
        }
    };

    useEffect(() => {
        const container = filterScrollRef.current;
        if (!container) return;

        checkScrollPosition();
        container.addEventListener("scroll", checkScrollPosition);

        const resizeObserver = new ResizeObserver(checkScrollPosition);
        resizeObserver.observe(container);

        return () => {
            container.removeEventListener("scroll", checkScrollPosition);
            resizeObserver.disconnect();
        };
    }, [plantTypes]);

    useEffect(() => {
        async function loadPlantTypes() {
            const res = await plantsApi.fetchPlantTypes();
            if (res.ok && res.plant_types) setPlantTypes(res.plant_types);
        }
        loadPlantTypes();
    }, []);

    useEffect(() => {
        async function loadPlants() {
            if (!auth.user) return;
            setLoading(true);

            const categoryMap: Record<string, number | undefined> = {};
            plantTypes.forEach((pt) => (categoryMap[pt.plant_name] = pt.id));
            categoryMap["All"] = undefined;

            const plant_type_id = categoryMap[selectedCategory];

            const res = await plantsApi.fetchPlantsOfUser(
                auth.user.username,
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
    }, [auth.user, selectedCategory, search, page, reload, plantTypes]);

    const handleCardClick = (plant: PlantType) => {
        setSelectedPlant(plant);
        setOpen(true);
    };

    const renderPageButtons = () => {
        if (!meta) return null;
        const pages = [];
        for (let i = 1; i <= meta.max_page; i++) {
            pages.push(
                <Button
                    key={i}
                    size="sm"
                    variant={i === page ? "default" : "outline"}
                    onClick={() => setPage(i)}
                    className="hover:!bg-primary hover:!border-transparent"
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    return (
        <div className="bg-base-200 h-screen overflow-y-auto">
            {/* top controls */}
            <div className="bg-base-100 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
                    <div className="w-full sm:w-auto">
                        <GardenAddPlant
                            onAdded={() => setReload((r) => r + 1)}
                        />
                    </div>

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

                    <div className="relative group">
                        {canScrollLeft && (
                            <button
                                onClick={() => scroll("left")}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}

                        <div
                            ref={filterScrollRef}
                            className={cn(
                                "flex gap-2 overflow-x-auto cursor-grab active:cursor-grabbing select-none",
                                styles.scrollbarhide
                            )}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                        >
                            {[
                                "All",
                                ...plantTypes.map((pt) => pt.plant_name),
                            ].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setPage(1);
                                    }}
                                    className={cn(
                                        "btn btn-sm flex-shrink-0",
                                        selectedCategory === category
                                            ? "btn-success"
                                            : "btn-ghost bg-gray-200"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {canScrollRight && (
                            <button
                                onClick={() => scroll("right")}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
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
                        <Button
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        >
                            Prev
                        </Button>

                        {renderPageButtons()}

                        <Button
                            size="sm"
                            disabled={page >= meta.max_page}
                            onClick={() =>
                                setPage((p) => Math.min(p + 1, meta.max_page))
                            }
                        >
                            Next
                        </Button>
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

export default MyGarden;
