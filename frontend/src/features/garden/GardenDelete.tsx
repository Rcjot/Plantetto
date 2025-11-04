import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import plantsApi from "@/api/plantsApi";

interface GardenDeleteProps {
    plant_uuid: string;
    plant_nickname?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

export default function GardenDelete({
    plant_uuid,
    plant_nickname,
    open,
    onOpenChange,
    onDeleted,
}: GardenDeleteProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const res = await plantsApi.deletePlant(plant_uuid);
            if (res.ok) {
                onDeleted?.();
                onOpenChange(false);
            } else {
                setError("Failed to delete plant. Try again.");
            }
        } catch (err) {
            console.error("Error deleting plant:", err);
            setError("Network error. Try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (!open) {
            setError(null);
            setIsDeleting(false);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-base-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-warning">
                        Delete Plant
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <span className="font-medium">
                            {plant_nickname ?? "this plant"}
                        </span>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="p-3 mt-4 bg-red-50 text-error rounded-md text-sm">
                        {error}
                    </div>
                )}

                <DialogFooter className="mt-6 flex justify-end gap-3">
                    <button
                        className={`btn ${isDeleting ? "btn-disabled opacity-50" : ""}`}
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>

                    <button
                        className={`btn btn-warning ${
                            isDeleting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
