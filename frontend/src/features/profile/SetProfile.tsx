import { useRef, useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import defaultpfp from "@/assets/defaultpfp.png";
import ProfileCropper from "./ProfileCropper";
import profileApi from "@/api/profileApi";
import arrowdownicon from "@/assets/arrowdownicon.svg";
import arrowupicon from "@/assets/arrowupicon.svg";

function SetProfile() {
    const inputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { auth, fetchCredentials } = useAuthContext()!;
    const [imageSrc, setImageSrc] = useState<string>("");
    const [pfpPreview, setPfpPreview] = useState<string>(
        auth.user?.pfp_url ?? defaultpfp
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showCrop, setShowCrop] = useState<boolean>(false);

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        console.log(e.target.files);
        if (!e.target.files) return;
        if (e.target.files.length === 0) return;
        const file = e.target.files[0];

        const url = URL.createObjectURL(file);
        setImageSrc(url);
        setShowCrop(true);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        if (canvasRef.current) {
            canvasRef.current.toBlob(
                async (blob) => {
                    if (blob) {
                        const formData = new FormData();

                        formData.append("image", blob);

                        await profileApi.sendImage(formData);
                        await fetchCredentials();
                        setIsSubmitting(false);
                    }
                },
                "image/jpg",
                0.9
            );
        }
    }
    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 items-center min-w-[200px] sm:min-w-[500px]"
            >
                <button
                    className="btn btn-neutral self-end"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "saving..." : "save"}
                </button>

                <fieldset className="flex flex-col">
                    <input
                        ref={inputRef}
                        type="file"
                        className="file-input hidden"
                        accept="image/"
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
                {imageSrc != "" && (
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
                    {imageSrc != "" && (
                        <ProfileCropper
                            imgSrc={imageSrc}
                            setPfpPreview={setPfpPreview}
                            canvasRef={canvasRef}
                        />
                    )}
                </div>
            </form>
        </>
    );
}

export default SetProfile;
