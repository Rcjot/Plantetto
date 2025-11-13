import { useCallback, useEffect, useState } from "react";
import type { GuideType } from "@/features/guides/guideTypes";
import type { MetaDataType } from "@/api/plantsApi";
import { useAuthContext } from "@/features/auth/AuthContext";
import guidesApi from "@/api/guidesApi";

function useFetchGuideBoard() {
    const { auth } = useAuthContext()!;
    const [loading, setLoading] = useState(false);
    const [board, setBoard] = useState<GuideType[] | null>(null);
    const [search, setSearch] = useState("");
    const [meta, setMeta] = useState<MetaDataType | null>(null);
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [categoryMap, setCategoryMap] = useState<
        Record<string, number | undefined>
    >({});
    const fetchBoard = useCallback(async () => {
        const plant_type_id = categoryMap[selectedCategory];

        if (auth.user?.username) {
            const res = await guidesApi.getUserBoard(
                auth.user.username,
                search,
                plant_type_id,
                page
            );
            setBoard(res.board);
            if (res.ok && res.board) {
                setBoard(res.board);
                const meta_data: MetaDataType = res.meta_data;

                let safePage = page;
                if (page > meta_data.max_page) safePage = meta_data.max_page;
                if (page < 1) safePage = 1;
                if (res.board.length > 0 && page !== safePage) {
                    setPage(safePage);
                } else if (res.board.length > 0 && page === safePage) {
                    setBoard(res.board);
                }

                setMeta(meta_data);
            } else {
                setBoard([]);
                setMeta(null);
                if (page !== 1) setPage(1);
            }
            setLoading(false);
        }
    }, [auth, page, search, categoryMap, selectedCategory]);

    useEffect(() => {
        fetchBoard();
    }, [fetchBoard]);

    return {
        board,
        fetchBoard,
        loading,
        meta,
        setCategoryMap,
        selectedCategory,
        page,
        setPage,
        setSelectedCategory,
        search,
        setSearch,
    };
}

export default useFetchGuideBoard;
