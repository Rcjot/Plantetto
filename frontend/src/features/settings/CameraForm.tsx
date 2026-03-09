import Webcam from "react-webcam";
import { CameraIcon } from "lucide-react";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useRef, useState } from "react";
import usersApi from "@/api/usersApi";
import { toast } from "react-toastify";
import { useAuthContext } from "../auth/AuthContext";

function base64ToBlob(base64: string) {
    // remove "data:*/*;base64," prefix
    const [metadata, data] = base64.split(",");
    const contentType = metadata.match(/:(.*?);/)?.[1] || "image/jpeg";
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}

export default function CameraForm() {
    const { fetchCredentials } = useAuthContext()!;
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const videoConstraints = {
        widht: 1280,
        height: 720,
        facingMode: "user",
    };

    const webcamRef = useRef<Webcam | null>(null);

    const submitCapture = useCallback(
        async (imageSrc: string) => {
            setLoading(true);
            const blob = base64ToBlob(imageSrc);
            const file = new File([blob], "capture.jpg", { type: blob.type });
            const formData = new FormData();
            formData.append("image", file);

            const { ok, has_face } = await usersApi.detectFace(formData);
            console.log(ok, has_face);
            if (ok) {
                if (has_face) {
                    const message =
                        currentStep === 0
                            ? "ID detected :D"
                            : "Face detected :D";
                    toast.success(message, { position: "bottom-center" });

                    console.log(currentStep);
                    if (currentStep === 1) {
                        // success here
                        const { ok } = await usersApi.verifyToSellUser();
                        if (ok) {
                            toast.success("you are now verified to sell! :D", {
                                position: "bottom-center",
                            });

                            setCurrentStep((p) => p + 1);

                            fetchCredentials();
                            return;
                        }
                    }

                    setCurrentStep((p) => p + 1);
                } else {
                    const message =
                        currentStep === 0
                            ? "Couldn't detect an ID, please try again."
                            : "Couldn't detect a Face, please try again.";
                    toast.warning(message, { position: "bottom-center" });
                }
            } else {
                toast.error("something went wrong");
            }
            setLoading(false);
        },
        [currentStep, fetchCredentials]
    );

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                submitCapture(imageSrc);
            }
        }
    }, [webcamRef, submitCapture]);

    const isStepOne = currentStep >= 0;
    const isStepTwo = currentStep > 0;
    const isDone = currentStep > 1;

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    {`Please take a photo of your ${currentStep == 0 ? "ID" : "Face"} using the camera.`}
                </DialogTitle>
                <DialogDescription className="text-secondary">
                    be assured that the photo won't be saved in the system. :)
                </DialogDescription>
                <ul className="steps transition-all">
                    <li
                        data-content={isStepTwo ? "✓" : "1"}
                        className={`step ${isStepOne && "step-primary"}`}
                    >
                        ID
                    </li>
                    <li
                        data-content={isDone ? "✓" : "2"}
                        className={`step ${isStepTwo && "step-primary"}`}
                    >
                        Face
                    </li>

                    <li
                        data-content="✓"
                        className={`step ${isDone && "step-primary"}`}
                    >
                        Done
                    </li>
                </ul>
            </DialogHeader>
            <Webcam
                audio={false}
                height={600}
                ref={webcamRef}
                width={600}
                videoConstraints={videoConstraints}
            />
            {!isDone ? (
                <button
                    onClick={capture}
                    className="btn btn-primary w-fit self-center ml-auto mr-auto "
                >
                    {loading ? "analyzing..." : "Take Photo"}
                    <CameraIcon />
                </button>
            ) : (
                <div className=" w-fit self-center ml-auto mr-auto">
                    You're all set (:
                </div>
            )}
        </>
    );
}
