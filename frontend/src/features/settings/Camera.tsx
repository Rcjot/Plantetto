import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CameraForm from "./CameraForm";
import { useState } from "react";

export function CameraDialog() {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button>No Close Button</button>
            </DialogTrigger>
            <DialogContent showCloseButton={false} className="bg-white">
                {open && <CameraForm />}
            </DialogContent>
        </Dialog>
    );
}
