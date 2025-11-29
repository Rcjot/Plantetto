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
import plantsApi from "@/api/plantsApi";
import type { PlantOptionType } from "@/features/garden/gardenTypes";

export default function CreateListingModal() {
    const [open, setOpen] = useState(false);
    const [plantOptions, setPlantOptions] = useState<PlantOptionType[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const { auth } = useAuthContext()!;

    useEffect(() => {
        async function loadPlantOptions() {
            if (auth.user?.username) {
                const res = await plantsApi.fetchPlantsOfUser(
                    auth.user.username,
                    "",
                    undefined,
                    1
                );
                if (res.ok && res.plants) {
                    const options: PlantOptionType[] = res.plants.map((p) => ({
                        id: p.plant_uuid,
                        uuid: p.plant_uuid,
                        nickname: p.nickname,
                    }));
                    setPlantOptions(options);
                }
            }
        }
        if (open) {
            loadPlantOptions();
        }
    }, [open, auth.user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = () => {
        console.log("Create listing");
        setOpen(false);
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
                    <div className="space-y-2">
                        <Label>Plant Image</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded"
                                />
                            ) : (
                                <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
                                    <p className="text-gray-400">
                                        Image preview will appear here
                                    </p>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-4"
                            />
                        </div>
                        <p className="text-xs text-base-content/70">
                            Required - Be as descriptive as possible
                        </p>
                    </div>

                    {/* plant select */}
                    <div className="space-y-2">
                        <Label htmlFor="plant">Select Plant</Label>
                        <Select>
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
                            />
                        </div>
                    </div>

                    {/* description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your plant..."
                            rows={6}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <DialogClose asChild>
                            <button type="button" className="btn btn-warning">
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleSubmit}
                        >
                            Create Listing
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
