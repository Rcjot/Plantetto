import { useEffect, useState } from "react";
import type { GuideType } from "../guideTypes";
import guidesApi from "@/api/guidesApi";

function useFetchPublishedGuides() {
    const [guides, setGuides] = useState<GuideType[] | null>(null);
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryMap, setCategoryMap] = useState<
        Record<string, number | undefined>
    >({});
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchGuide = async () => {
            const plant_type_id = categoryMap[selectedCategory];

            const { guides: resGuides } = await guidesApi.getPublishedGuides(
                search,
                plant_type_id ?? undefined,
                page
            );
            setGuides(resGuides);
        };
        fetchGuide();
    }, [page, search, categoryMap, selectedCategory]);

    return {
        guides,
        page,
        setPage,
        selectedCategory,
        setCategoryMap,
        setSelectedCategory,
        search,
        setSearch,
    };
}

export default useFetchPublishedGuides;
