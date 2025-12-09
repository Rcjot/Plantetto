import type { UserType } from "@/features/auth/authTypes";
import type {
    DiaryMediaType,
    PlantDiaryType,
} from "@/features/diary/diaryTypes";
import plantPlaceHolder from "@/assets/plant_placeholder.png";
import type { PlantType } from "@/features/garden/gardenTypes";
import { useState, useRef, useEffect } from "react";

interface DiaryCircleProps {
    user: UserType;
    thumbnail: DiaryMediaType;
    plant: PlantType;
    diaries?: PlantDiaryType[];
}

function DiaryCircle({ thumbnail, plant, diaries = [] }: DiaryCircleProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const slideIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const mediaDiaries = diaries.filter(
        (diary) => diary.media_url && diary.media_type === "image"
    );

    const shouldShowCarousel = isHovering && mediaDiaries.length > 1;

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setIsHovering(false);
    };

    useEffect(() => {
        if (shouldShowCarousel) {
            slideIntervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % mediaDiaries.length);
            }, 1000);
        } else {
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
                slideIntervalRef.current = null;
            }
            setCurrentSlide(0);
        }

        return () => {
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
            }
        };
    }, [shouldShowCarousel, mediaDiaries.length]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
            }
        };
    }, []);

    // Get current image to display
    const getCurrentImage = () => {
        if (shouldShowCarousel && mediaDiaries[currentSlide]) {
            return mediaDiaries[currentSlide].media_url!;
        } else if (mediaDiaries.length > 0) {
            return mediaDiaries[0].media_url!;
        } else if (thumbnail.media_url && thumbnail.media_type === "image") {
            return thumbnail.media_url;
        }
        return null;
    };

    const currentImage = getCurrentImage();

    return (
        <div
            className="flex flex-col items-center justify-center gap-1 cursor-pointer mx-2 mr-6"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="avatar mt-2 relative">
                <div
                    className={`ring-primary ring-offset-base-100 w-18 rounded-full ring-2 ring-offset-2 flex items-center justify-center overflow-hidden transition-all duration-300 ${isHovering ? "scale-105" : "scale-100"}`}
                >
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt={plant.nickname}
                            className="w-full h-full object-cover transition-opacity duration-500"
                        />
                    ) : thumbnail.media_url ? (
                        thumbnail.media_type === "image" ? (
                            <img
                                src={thumbnail.media_url}
                                alt={plant.nickname}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                            >
                                <source src={thumbnail.media_url} />
                            </video>
                        )
                    ) : (
                        <img
                            src={plantPlaceHolder}
                            alt="plant"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            <div className="h-fit text-base-100-content text-center font-bold px-2 text-sm rounded w-fit flex items-center justify-center">
                {plant.nickname}
            </div>
        </div>
    );
}

export default DiaryCircle;
