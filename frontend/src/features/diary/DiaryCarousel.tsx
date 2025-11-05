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
import type { DiaryCardType } from "./diaryTypes";
import { useEffect, useState } from "react";

function DiaryCarousel() {
    const [diaryCardList, setDiaries] = useState<DiaryCardType[]>([]);

    useEffect(() => {
        const fetchDiaries = async () => {
            const { ok, plantDiaries } = await diariesApi.fetchDiariesToday();
            if (ok) {
                setDiaries(plantDiaries);
            }
        };
        fetchDiaries();
    }, []);

    if (diaryCardList.length == 0) return <div>no diaries today</div>;

    return (
        <Carousel className="w-3/4">
            <CarouselContent>
                {diaryCardList.map((diaryCard) => {
                    return (
                        <CarouselItem key={`${diaryCard.user.id}`}>
                            <DiaryPopup
                                diaryCard={diaryCard}
                                user={diaryCard.user}
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
    );
}

export default DiaryCarousel;