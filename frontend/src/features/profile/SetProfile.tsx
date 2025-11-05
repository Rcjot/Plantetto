import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useAuthContext } from "../auth/AuthContext";
import defaultpfp from "@/assets/defaultpfp.png";
import ProfileCropper from "./ProfileCropper";
import arrowdownicon from "@/assets/arrowdownicon.svg";
import arrowupicon from "@/assets/arrowupicon.svg";

export interface SetProfileRef {
    getProfileData: () => Promise<FormData | null>;
    hasUnsavedCrop: () => boolean;
}

interface SetProfileProps {
    onCropStatusChange?: (hasUnsavedCrop: boolean) => void;
}

const SetProfile = forwardRef<SetProfileRef, SetProfileProps>(
    ({ onCropStatusChange }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const { auth } = useAuthContext()!;
        const [imageSrc, setImageSrc] = useState<string>("");
        const [pfpPreview, setPfpPreview] = useState<string>(
            auth.user?.pfp_url ?? defaultpfp
        );
        const [showCrop, setShowCrop] = useState<boolean>(false);
        const [hasChanges, setHasChanges] = useState<boolean>(false);
        const [imageSelectedButNotCropped, setImageSelectedButNotCropped] =
            useState<boolean>(false);

        useImperativeHandle(ref, () => ({
            getProfileData: async () => {
                if (!hasChanges || !canvasRef.current) return null;

                return new Promise((resolve) => {
                    canvasRef.current!.toBlob(
                        (blob) => {
                            if (blob) {
                                const formData = new FormData();
                                formData.append("image", blob);
                                resolve(formData);
                            } else {
                                resolve(null);
                            }
                        },
                        "image/jpg",
                        0.9
                    );
                });
            },
            hasUnsavedCrop: () => {
                return imageSelectedButNotCropped;
            },
        }));

        function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
            if (!e.target.files || e.target.files.length === 0) return;
            const file = e.target.files[0];

            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setShowCrop(true);
            setHasChanges(true);
            setImageSelectedButNotCropped(true);
            onCropStatusChange?.(true);
        }

        function handleCropComplete() {
            setImageSelectedButNotCropped(false);
            onCropStatusChange?.(false);
        }

        return (
            <div className="flex flex-col gap-2 items-center min-w-[200px] sm:min-w-[500px]">
                <fieldset className="flex flex-col">
                    <input
                        ref={inputRef}
                        type="file"
                        className="file-input hidden"
                        accept="image/*"
                        onChange={handleImage}
                    />
                    <button
                        type="button"
                        className="bg-black rounded-full"
                        onClick={() => {
                            inputRef.current?.click();
                        }}
                    >
                        <img
                            src={pfpPreview}
                            alt="choose photo"
                            className="rounded-full w-[150px] h-[150px] transition-opacity duration-200 hover:opacity-60"
                        />
                    </button>
                </fieldset>
                {imageSrc !== "" && (
                    <button
                        type="button"
                        onClick={() => {
                            setShowCrop((prev) => !prev);
                        }}
                    >
                        <img
                            src={showCrop ? arrowupicon : arrowdownicon}
                            alt="togglecrop"
                        />
                    </button>
                )}
                <div className={showCrop ? "" : "hidden"}>
                    {imageSrc !== "" && (
                        <ProfileCropper
                            imgSrc={imageSrc}
                            setPfpPreview={setPfpPreview}
                            canvasRef={canvasRef}
                            onCropComplete={handleCropComplete}
                        />
                    )}
                </div>
            </div>
        );
    }
);

SetProfile.displayName = "SetProfile";

export default SetProfile;