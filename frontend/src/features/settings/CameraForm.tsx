import Webcam from "react-webcam";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useRef, useState } from "react";

export default function CameraForm() {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const videoConstraints = {
        widht: 1280,
        height: 720,
        facingMode: "user",
    };

    const webcamRef = useRef<Webcam | null>(null);

    const capture = useCallback(() => {
        console.log(webcamRef.current);
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCurrentStep((p) => p + 1);
            console.log(imageSrc);
        }
    }, [webcamRef]);

    const isStepOne = currentStep >= 0;
    const isStepTwo = currentStep > 0;
    const isDone = currentStep > 1;

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    Please, take a photo of your ID using the camera.
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
            <button onClick={capture} className="btn btn-primary">
                capture photo
            </button>
        </>
    );
}
