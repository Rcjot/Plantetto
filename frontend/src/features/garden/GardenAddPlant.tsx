import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import GardenForm from "./GardenForm";

export default function GardenAddPlant({ onAdded }: { onAdded?: () => void }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleDialogOpenChange(nextOpen: boolean) {
        if (isSubmitting) return;
        setOpen(nextOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <button className="btn btn-primary">Add Plant</button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-md bg-base-100 max-h-[80vh] overflow-y-auto"
                {...(isSubmitting
                    ? { onClose: () => {}, backdropClickClose: false }
                    : {})}
            >
                <DialogHeader>
                    <DialogTitle>Add New Plant</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to add a plant to your
                        garden.
                    </DialogDescription>
                </DialogHeader>

                <GardenForm
                    setSubmitting={setIsSubmitting}
                    onSuccess={() => {
                        setOpen(false);
                        onAdded?.();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
