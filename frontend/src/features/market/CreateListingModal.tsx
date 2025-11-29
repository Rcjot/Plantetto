import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useAuthContext } from "@/features/auth/AuthContext";
import diariesApi from "@/api/diariesApi";
import marketApi from "@/api/marketApi";
import type { PlantOptionType } from "@/features/garden/gardenTypes";

export default function CreateListingModal({
    onSuccess,
}: {
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [plantOptions, setPlantOptions] = useState<PlantOptionType[]>([]);
    const [selectedPlantId, setSelectedPlantId] = useState<string>("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{
        description?: string[];
        price?: string[];
        plant_id?: string[];
        root?: string[];
    }>({});

    const { auth } = useAuthContext()!;

    useEffect(() => {
        async function loadPlantOptions() {
            if (auth.user?.username) {
                const res = await diariesApi.getUserPlantsOptions(
                    auth.user.username
                );
                if (res.ok && res.plantOptions) {
                    setPlantOptions(res.plantOptions);
                }
            }
        }
        if (open) {
            loadPlantOptions();
            setSelectedPlantId("");
            setDescription("");
            setPrice("");
            setErrors({});
        }
    }, [open, auth.user]);

    const handleSubmit = async () => {
        if (!selectedPlantId || !price) {
            setErrors({
                plant_id: !selectedPlantId
                    ? ["Please select a plant"]
                    : undefined,
                price: !price ? ["Please enter a price"] : undefined,
            });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append("description", description);
        formData.append("price", price);
        formData.append("plant_id", selectedPlantId);

        const res = await marketApi.addMarketItem(formData);

        if (res.ok) {
            setOpen(false);
            onSuccess?.();
        } else {
            setErrors(res.errors || { root: ["Failed to create listing"] });
        }

        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="btn btn-success">Create Listing</button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md bg-base-100 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Listing</DialogTitle>
                    <DialogDescription>
                        List one of your plants for sale
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* plant selection */}
                    <div className="space-y-2">
                        <Label htmlFor="plant">Select Plant</Label>
                        <Select
                            value={selectedPlantId}
                            onValueChange={setSelectedPlantId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose from your plants" />
                            </SelectTrigger>
                            <SelectContent className="bg-base-100">
                                {plantOptions.length > 0 ? (
                                    plantOptions.map((plant) => (
                                        <SelectItem
                                            key={plant.id}
                                            value={plant.id}
                                            className="data-[highlighted]:bg-neutral-200"
                                        >
                                            {plant.nickname}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="p-2 text-neutral-400">
                                        No plants available
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                        {errors.plant_id && (
                            <p className="text-sm text-warning-content">
                                {errors.plant_id[0]}
                            </p>
                        )}
                    </div>

                    {/* price */}
                    <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">₱</span>
                            <Input
                                id="price"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        {errors.price && (
                            <p className="text-sm text-warning-content">
                                {errors.price[0]}
                            </p>
                        )}
                    </div>

                    {/* description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description (Optional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your plant..."
                            rows={6}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && (
                            <p className="text-sm text-warning-content">
                                {errors.description[0]}
                            </p>
                        )}
                    </div>

                    {errors.root && (
                        <p className="text-sm text-warning-content">
                            {errors.root[0]}
                        </p>
                    )}

                    {/* action buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="btn btn-warning"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Listing"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
