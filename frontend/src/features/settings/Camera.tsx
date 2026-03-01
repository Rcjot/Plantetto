import { Dialog, DialogContent } from "@/components/ui/dialog";
import CameraForm from "./CameraForm";

export function CameraDialog({
    open,
    setOpenCamera,
}: {
    open: boolean;
    setOpenCamera: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpenCamera}>
            <DialogContent showCloseButton={false} className="bg-white">
                {open && <CameraForm />}
            </DialogContent>
        </Dialog>
    );
}
