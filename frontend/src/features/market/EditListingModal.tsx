import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import marketApi from "@/api/marketApi";
import type { MarketItemType } from "@/features/market/marketTypes";

interface EditListingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: MarketItemType;
    onSuccess?: () => void;
}

export default function EditListingModal({
    open,
    onOpenChange,
    item,
    onSuccess,
}: EditListingModalProps) {
    const [description, setDescription] = useState(item.description || "");
    const [price, setPrice] = useState(item.price);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{
        description?: string[];
        price?: string[];
        root?: string[];
    }>({});

    useEffect(() => {
        if (open) {
            setDescription(item.description || "");
            setPrice(item.price);
            setErrors({});
        }
    }, [open, item]);

    const handleSubmit = async () => {
        if (!price) {
            setErrors({
                price: ["Please enter a price"],
            });
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData();
        formData.append("description", description);
        formData.append("price", price);

        const res = await marketApi.updateMarketItem(item.uuid, formData);

        if (res.ok) {
            onOpenChange(false);
            onSuccess?.();
        } else {
            setErrors({ root: ["Failed to update listing"] });
        }

        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-base-100 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Listing</DialogTitle>
                    <DialogDescription>
                        Update your listing details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* plant preview */}
                    <div className="rounded-lg border border-gray-200 p-4 bg-base-200">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            Plant (cannot be changed)
                        </p>
                        <div className="flex gap-3 items-center">
                            <img
                                src={item.plant.picture_url}
                                alt={item.plant.nickname}
                                className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div>
                                <p className="font-semibold">
                                    {item.plant.nickname}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.plant.plant_type}
                                </p>
                            </div>
                        </div>
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
                            {isSubmitting ? "Updating..." : "Update Listing"}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
