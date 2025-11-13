import { useState, useEffect, useRef } from "react";
import type { PlanttypeType } from "@/features/garden/gardenTypes";
import plantsApi from "@/api/plantsApi";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../../features/garden/filter_scroll.module.css";
import { cn } from "@/lib/utils";

interface FilterScrollProps {
    setPage: React.Dispatch<React.SetStateAction<number>>;
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

function FilterScroll({
    setPage,
    selectedCategory,
    setSelectedCategory,
}: FilterScrollProps) {
    // Refs and scroll control
    const [plantTypes, setPlantTypes] = useState<PlanttypeType[]>([]);

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

    return (
        <>
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
                    {["All", ...plantTypes.map((pt) => pt.plant_name)].map(
                        (category) => (
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
                        )
                    )}
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
        </>
    );
}

export default FilterScroll;
