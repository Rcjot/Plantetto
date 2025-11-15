import { useEffect, useState } from "react";
import type { GuideType } from "../guideTypes";
import type { MetaDataType } from "@/api/plantsApi";
import guidesApi from "@/api/guidesApi";

function useFetchPublishedGuides() {
    const [loading, setLoading] = useState(false);
    const [guides, setGuides] = useState<GuideType[] | null>(null);
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryMap, setCategoryMap] = useState<
        Record<string, number | undefined>
    >({});
    const [search, setSearch] = useState("");
    const [meta, setMeta] = useState<MetaDataType | null>(null);

    useEffect(() => {
        const fetchGuide = async () => {
            setLoading(true);
            const plant_type_id = categoryMap[selectedCategory];

            const res = await guidesApi.getPublishedGuides(
                search,
                plant_type_id ?? undefined,
                page
            );
            if (res.ok && res.guides) {
                setGuides(res.guides);
                const meta_data: MetaDataType = res.meta_data;

                let safePage = page;
                if (page > meta_data.max_page) safePage = meta_data.max_page;
                if (page < 1) safePage = 1;
                if (res.guides.length > 0 && page !== safePage) {
                    setPage(safePage);
                } else if (res.guides.length > 0 && page === safePage) {
                    setGuides(res.guides);
                }

                setMeta(meta_data);
            } else {
                setGuides([]);
                setMeta(null);
                if (page !== 1) setPage(1);
            }
            setLoading(false);
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
        meta,
        loading,
    };
}

export default useFetchPublishedGuides;
