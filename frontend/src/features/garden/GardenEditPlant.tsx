import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import GardenFormEdit from "./GardenFormEdit";
import type { PlantType } from "@/features/garden/gardenTypes";

interface GardenEditPlantProps {
    plant: PlantType;
    onUpdated?: () => void;
    onCloseDetails: () => void;
}

export default function GardenEditPlant({
    plant,
    onUpdated,
    onCloseDetails,
}: GardenEditPlantProps) {
    const [open, setOpen] = useState(false);

    function handleDialogOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default" className="w-[200px]">
                    Edit plant
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-base-100">
                <DialogHeader>
                    <DialogTitle>Edit Plant</DialogTitle>
                    <DialogDescription>
                        Update the details of your plant below.
                    </DialogDescription>
                </DialogHeader>

                <GardenFormEdit
                    plant={plant}
                    onSuccess={() => {
                        setOpen(false);
                        onUpdated?.();
                        onCloseDetails();
                    }}
                    onClose={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
