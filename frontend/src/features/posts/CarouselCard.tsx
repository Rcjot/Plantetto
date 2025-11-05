import { useRef } from "react";

function CarouselCard({
    keyId,
    src,
    mediaType,
    carouselIndex,
    view = "feed",
}: {
    keyId: number;
    src: string;
    mediaType: string;
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
            className={`relative card card-xl border min-w-full ${
                view == "feed" ? "max-h-[500px]" : ""
            } bg-base-200 flex flex-col justify-center overflow-hidden `}
            style={
                mediaType === "image"
                    ? { backgroundImage: `url(${src})` }
                    : { backgroundColor: "black" }
            }
        >
            {mediaType === "image" ? (
                <>
                    <div className="absolute rounded-xl inset-0 backdrop-blur-lg"></div>
                    <img
                        src={src}
                        className="w-full object-contain z-1 select-none"
                        alt="image"
                    />
                </>
            ) : (
                <video
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
        </div>
    );
}

export default CarouselCard;
