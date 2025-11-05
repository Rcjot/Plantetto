import { useRef } from "react";
import plantPlaceHolder from "@/assets/plant_placeholder.png";

function CarouselCard({
    keyId,
    src,
    mediaType,
    carouselIndex,
    view = "feed",
}: {
    keyId: number;
    src: string | null;
    mediaType: string | null;
    carouselIndex: number;
    view?: "feed" | "viewpost";
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    if (mediaType === "video" && videoRef.current && carouselIndex != keyId) {
        videoRef.current?.pause();
    }

    return (
        <div
            key={keyId}
            // className="card card-xl h-[650px] w-[550px] border bg-200 m-4 flex flex-col p-2 items-center"
            className={`card card-xl border min-w-full  max-h-[70vh] ${
                view == "feed" ? "max-h-[500px]" : ""
            } bg-base-base-200 flex flex-col justify-center overflow-hidden`}
            style={
                mediaType === "image"
                    ? { backgroundImage: `url(${src})` }
                    : { backgroundColor: "black" }
            }
        >
            {src ? (
                <>
                    {mediaType === "image" ? (
                        <>
                            <div className="absolute inset-0 backdrop-blur-lg"></div>
                            <img
                                src={src}
                                className="w-full max-h-full object-contain z-1 select-none"
                                alt="image"
                            />
                        </>
                    ) : (
                        <video
                            key={src}
                            className="select-none"
                            ref={videoRef}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            controls
                        >
                            <source src={src} />
                        </video>
                    )}
                </>
            ) : (
                <img
                    src={plantPlaceHolder}
                    className="bg-base-100"
                    alt="plant"
                />
            )}
        </div>
    );
}

export default CarouselCard;