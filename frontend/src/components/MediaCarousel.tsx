import React, { useEffect } from "react";
import CarouselCard from "./CarouselCard";
import { SquareChevronLeft } from 'lucide-react';
import { SquareChevronRight } from 'lucide-react';

import type { PlantDiaryType } from "@/features/diary/diaryTypes";

function MediaCarousel({
    mediaList,
    view = "feed",
    highlight_height = 0,
    highlight_width = 0,
    setContent,
    currentIndex,
    setCurrentIndex,
}: {
    mediaList: PlantDiaryType[];
    view?: "feed" | "viewpost";
    highlight_height?: number;
    highlight_width?: number;
    setContent: (index: number) => void;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
    useEffect(() => {
        if (mediaList.length === 1) {
            setCurrentIndex(0);
        }
    }, [mediaList, setCurrentIndex]);

    function handlePrevClick(e?: React.MouseEvent<HTMLDivElement>) {
        if (e) {
            e.stopPropagation();
        }
        if (currentIndex == 0) return;
        setContent(currentIndex - 1);
        setCurrentIndex((currentIndex) => currentIndex - 1);
    }
    function handleNextClick(e?: React.MouseEvent<HTMLDivElement>) {
        if (e) {
            e.stopPropagation();
        }
        if (currentIndex == mediaList.length - 1) return;
        setContent(currentIndex + 1);
        setCurrentIndex((currentIndex) => currentIndex + 1);
    }
    return (
        <div
            className={` max-w-full max-h-full relative ${
                view == "feed" ? "" : "sm:min-w-[400px]  lg:min-w-[500px] "
            }`}
            style={{
                aspectRatio: `${highlight_width}/${highlight_height}`,
            }}
        >
            <div
                role="button"
                tabIndex={0}
                className={`absolute left-[-3%] top-[50%] z-1 cursor-pointer ${
                    currentIndex == 0 ? "hidden" : ""
                }`}
                onClick={handlePrevClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handlePrevClick();
                    }
                }}
            >
                <SquareChevronLeft className="w-10 h-10 text-zinc-700" />
            </div>
            <div
                role="button"
                tabIndex={0}
                className={`absolute right-[-3%] top-[50%] z-1 cursor-pointer ${
                    currentIndex == mediaList.length - 1 ? "hidden" : ""
                }`}
                onClick={handleNextClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNextClick();
                    }
                }}
            >
                <SquareChevronRight className="w-10 h-10 text-zinc-700" />
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {mediaList.map((media, i) => (
                        <CarouselCard
                            key={i}
                            keyId={i}
                            src={media.media_url}
                            mediaType={media.media_type}
                            carouselIndex={currentIndex}
                            view={view}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MediaCarousel;