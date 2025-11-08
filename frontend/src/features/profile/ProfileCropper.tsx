import React, { useRef, useState } from "react";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type PercentCrop,
    convertToPixelCrop,
} from "react-image-crop";
import setCanvasPreview from "@/features/profile/SetCanvasPreview";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 75;

function ProfileCropper({
    imgSrc,
    setPfpPreview,
    canvasRef,
    onCropComplete,
}: {
    imgSrc: string;
    setPfpPreview: React.Dispatch<React.SetStateAction<string>>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    onCropComplete?: () => void;
}) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<PercentCrop>();

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop);
    }

    function onCrop() {
        if (imgRef.current && canvasRef.current && crop) {
            setCanvasPreview(
                imgRef.current,
                canvasRef.current,
                convertToPixelCrop(
                    crop,
                    imgRef.current?.width,
                    imgRef.current?.height
                )
            );
            const dataUrl = canvasRef.current.toDataURL();
            setPfpPreview(dataUrl);
            onCropComplete?.();
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <ReactCrop
                crop={crop}
                circularCrop
                keepSelection
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENSION}
                onChange={(_pixelCrop, percentCrop) => {
                    setCrop(percentCrop);
                }}
            >
                <img
                    src={imgSrc}
                    alt="upload"
                    ref={imgRef}
                    className="min-h-[250px] !max-h-[300px] !max-w-[300px] sm:!max-h-[500px] sm:!max-w-[500px]"
                    onLoad={onImageLoad}
                />
            </ReactCrop>
            {imgRef.current && (
                <button
                    className="btn btn-primary"
                    onClick={onCrop}
                    type="button"
                >
                    crop image
                </button>
            )}
            {crop && (
                <canvas
                    ref={canvasRef}
                    className="mt-4"
                    style={{
                        objectFit: "contain",
                        width: MIN_DIMENSION,
                        height: MIN_DIMENSION,
                        display: "none",
                    }}
                />
            )}
        </div>
    );
}
export default ProfileCropper;
