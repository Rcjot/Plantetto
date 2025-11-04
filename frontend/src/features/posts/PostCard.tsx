import { useRef } from "react";

function PostCard({
    keyId,
    src,
    mediaType,
    carouselIndex,
}: {
    keyId: number;
    src: string;
    mediaType: string;
    carouselIndex: number;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    if (mediaType === "video" && videoRef.current && carouselIndex != keyId) {
        videoRef.current?.pause();
    }

    return (
        <div
            key={keyId}
            // className="card card-xl h-[650px] w-[550px] border bg-200 m-4 flex flex-col p-2 items-center"
            className="card card-xl border min-w-full bg-base-base-200 flex flex-col justify-center overflow-hidden"
            style={
                mediaType === "image"
                    ? { backgroundImage: `url(${src})` }
                    : { backgroundColor: "black" }
            }
        >
            {mediaType === "image" ? (
                <>
                    <div className="absolute inset-0 backdrop-blur-lg"></div>
                    <img
                        src={src}
                        className=" w-full max-h-[550px] object-contain z-1"
                        alt="image"
                    />
                </>
            ) : (
                <video ref={videoRef} controls>
                    <source src={src} />
                </video>
            )}
        </div>
    );
}

export default PostCard;
