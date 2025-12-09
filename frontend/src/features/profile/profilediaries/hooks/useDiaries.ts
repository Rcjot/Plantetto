import diariesApi from "@/api/diariesApi";
import type { DiaryCircleType } from "@/features/diary/diaryTypes";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function useDiaries() {
    const { username } = useParams();
    const [diaryCircleList, setDiaryCircleList] = useState<
        DiaryCircleType[] | null
    >(null);

    const fetchDiaries = useCallback(async () => {
        if (!username) return;
        const { ok, plantDiaries } =
            await diariesApi.fetchPlantsWithDiariesOfUser(username);
        if (ok) {
            setDiaryCircleList(plantDiaries);
        }
    }, [username]);

    useEffect(() => {
        fetchDiaries();
    }, [fetchDiaries]);

    return {
        diaryCircleList,
        setDiaryCircleList,
        fetchDiaries,
    };
}

export default useDiaries;
