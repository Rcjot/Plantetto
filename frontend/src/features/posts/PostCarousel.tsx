import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import arrowrightIcon from "@/assets/icons/arrowrighticon.svg";
import arrowleftIcon from "@/assets/icons/arrowlefticon.svg";
import type { MediaType } from "./postTypes";

function PostCarousel({ mediaList }: { mediaList: MediaType[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (mediaList.length === 1) {
            setCurrentIndex(0);
        }
    }, [mediaList]);

    function handlePrevClick() {
        if (currentIndex == 0) return;
        setCurrentIndex((currentIndex) => currentIndex - 1);
    }
    function handleNextClick() {
        if (currentIndex == mediaList.length - 1) return;
        setCurrentIndex((currentIndex) => currentIndex + 1);
    }

    return (
        <div className="w-full max-w-[600px] relative">
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
                <img src={arrowleftIcon} className="w-7 h-7" alt="" />
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
                <img src={arrowrightIcon} className="w-7 h-7" alt="" />
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {mediaList.map((media, i) => (
                        <PostCard
                            key={i}
                            keyId={i}
                            src={media.url}
                            mediaType={media.type}
                            carouselIndex={currentIndex}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostCarousel;
