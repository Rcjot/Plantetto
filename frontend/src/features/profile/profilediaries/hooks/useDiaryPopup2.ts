import diariesApi from "@/api/diariesApi";
import type {
    PlantDiaryType,
    DiaryCircleType,
} from "@/features/diary/diaryTypes";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function useDiaryPopup2(
    currentPlant: {
        uuid: string;
        date: string;
    } | null
) {
    const { username } = useParams();
    const [currentCarouselIndex, setCarouselIndex] = useState(0);
    const [diaryGroupByPlantOnDate, SetDiaryGroupByPlantOnDateList] =
        useState<DiaryCircleType | null>(null);
    const [diaryContent, setDiaryContent] = useState<PlantDiaryType | null>(
        null
    );
    const [currentDate, setCurrentDate] = useState<string | null>(
        currentPlant ? currentPlant.date : null
    );
    const [datesWithEntries, setDatesWithEntries] = useState<
        { date: string }[] | []
    >([]);

    useEffect(() => {
        if (!datesWithEntries || !currentPlant) return;
        console.log(datesWithEntries);
        if (datesWithEntries.length === 0) {
            setCurrentDate(currentPlant.date);
            return;
        }
        setCurrentDate(datesWithEntries[datesWithEntries.length - 1].date);
    }, [datesWithEntries, currentPlant]);

    function setCurrentDiaryContent(index: number) {
        if (!diaryGroupByPlantOnDate) return;
        setDiaryContent(diaryGroupByPlantOnDate.diaries[index]);
    }
    const fetchGroup = useCallback(async () => {
        if (!username || !currentDate || !currentPlant) return;
        const date = new Date(currentDate).toISOString().split("T")[0];

        const { ok, plantDiaries: plantDiaryGroupByPlantOnDate } =
            await diariesApi.fetchDiariesOfPlantOnDate(
                username,
                currentPlant.uuid,
                date
            );
        if (ok && plantDiaryGroupByPlantOnDate) {
            SetDiaryGroupByPlantOnDateList(plantDiaryGroupByPlantOnDate);
            setCarouselIndex(0);
            setDiaryContent(plantDiaryGroupByPlantOnDate.diaries[0]);
        }
    }, [username, currentPlant, currentDate]);

    useEffect(() => {
        const fetchDates = async () => {
            if (!username || !currentPlant) return;

            const { ok, datesWithEntries } =
                await diariesApi.fetchDatesWithEntriesOfPlants(
                    username,
                    currentPlant.uuid
                );

            if (ok) {
                setDatesWithEntries(datesWithEntries);
            }
        };
        fetchDates();
    }, [username, currentPlant]);

    useEffect(() => {
        fetchGroup();
    }, [fetchGroup]);

    return {
        currentCarouselIndex,
        setCarouselIndex,
        diaryGroupByPlantOnDate,
        diaryContent,
        setCurrentDiaryContent,
        fetchGroup,
        datesWithEntries,
        currentDate,
        setCurrentDate,
    };
}

export default useDiaryPopup2;
