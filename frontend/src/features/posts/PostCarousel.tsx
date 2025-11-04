import { useState } from "react";
import PostCard from "./PostCard";
import arrowrightIcon from "@/assets/icons/arrowrighticon.svg";
import arrowleftIcon from "@/assets/icons/arrowlefticon.svg";

function PostCarousel({ imageList }: { imageList: string[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    function handlePrevClick() {
        if (currentIndex == 0) return;
        setCurrentIndex((currentIndex) => currentIndex - 1);
    }
    function handleNextClick() {
        if (currentIndex == imageList.length - 1) return;
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
                    currentIndex == imageList.length - 1 ? "hidden" : ""
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
                    {imageList.map((slide, i) => (
                        <PostCard key={i} keyId={i} src={slide} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PostCarousel;
