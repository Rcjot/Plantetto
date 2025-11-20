import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import diariesApi from "@/api/diariesApi";
import DiaryPopup from "./DiaryPopup";
import DiaryCard from "./DiaryCard";
import DiaryAddPopup from "@/features/diary/DiaryAddPopup";
import type { DiaryCardType } from "./diaryTypes";
import { useCallback, useEffect, useState } from "react";

function DiaryCarouselSection() {
    const [diaryCardList, setDiaries] = useState<DiaryCardType[]>([]);

    const fetchDiaries = useCallback(async () => {
        const { ok, plantDiaries } =
            await diariesApi.fetchDiariesTodayFollowing();
        if (ok) {
            setDiaries(plantDiaries);
        }
    }, []);

    useEffect(() => {
        fetchDiaries();
    }, [fetchDiaries]);

    if (diaryCardList.length == 0)
        return (
            <div className="flex gap-3 w-full">
                <DiaryAddPopup fetchDiaries={fetchDiaries} />
            </div>
        );
    // console.log(diaryCardList);

    return (
        <div className="flex gap-3 w-full select-none ">
            <Carousel className="w-[83vw] sm:w-5/6">
                <CarouselContent>
                    <CarouselItem key={`nooneelsegotthiskey!`}>
                        <DiaryAddPopup fetchDiaries={fetchDiaries} />
                    </CarouselItem>

                    {diaryCardList.map((diaryCard) => {
                        // console.log(diaryCard);
                        if (!diaryCard.user) return <div>no user? </div>;
                        return (
                            <CarouselItem key={`${diaryCard.user.id}`}>
                                <DiaryPopup
                                    diaryCard={diaryCard}
                                    user={diaryCard.user}
                                    fetchDiaries={fetchDiaries}
                                >
                                    <DiaryCard
                                        user={diaryCard.user}
                                        thumbnail={diaryCard.thumbnail}
                                    />
                                </DiaryPopup>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

export default DiaryCarouselSection;
