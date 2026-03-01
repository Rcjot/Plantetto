import Webcam from "react-webcam";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCallback, useRef } from "react";

export function CameraDialog() {
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
            console.log(imageSrc);
        }
    }, [webcamRef]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button>No Close Button</button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="bg-white">
                <DialogHeader>
                    <DialogTitle>No Close Button</DialogTitle>
                    <DialogDescription>
                        This dialog doesn&apos;t have a close button in the
                        top-right corner.
                    </DialogDescription>
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
            </DialogContent>
        </Dialog>
    );
}
