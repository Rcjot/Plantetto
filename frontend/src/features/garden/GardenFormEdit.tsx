import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import plantsApi from "@/api/plantsApi";
import type { PlanttypeType, PlantType } from "@/features/garden/gardenTypes";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";

const schema = z.object({
    nickname: z.string().nonempty("required"),
    plant_description: z.string().optional(),
    plant_type: z.string().nonempty("required"),
    image: z.any().optional(),
});

export type GardenFormEditFields = z.infer<typeof schema>;

interface GardenFormEditProps {
    plant: PlantType;
    onSuccess?: () => void;
    onClose: () => void;
}

export default function GardenFormEdit({
    plant,
    onSuccess,
    onClose,
}: GardenFormEditProps) {
    const [plantTypes, setPlantTypes] = useState<PlanttypeType[]>([]);
    const [preview, setPreview] = useState<string | null>(
        plant.picture_url || null
    );

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<GardenFormEditFields>({
        resolver: zodResolver(schema),
        defaultValues: {
            nickname: plant.nickname,
            plant_description: plant.description,
            plant_type: plant.plant_type,
        },
    });

    useEffect(() => {
        async function loadPlantTypes() {
            const res = await plantsApi.fetchPlantTypes();
            if (res.ok && res.plant_types) setPlantTypes(res.plant_types);
            else setPlantTypes([]);
        }
        loadPlantTypes();
    }, []);

    // helper: draw file to canvas for high-quality upload
    const processFile = (file: File) => {
        return new Promise<Blob | null>((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = canvasRef.current!;
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d")!;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.95);
            };
        });
    };

    const onSubmit: SubmitHandler<GardenFormEditFields> = async (data) => {
        const selectedPlantType = plantTypes.find(
            (type) => type.plant_name === data.plant_type
        );

        if (!selectedPlantType || !selectedPlantType.id) {
            setError("plant_type", {
                message: "Invalid plant type selected",
            });
            return;
        }
        const formData = new FormData();
        formData.append("nickname", data.nickname);
        if (data.plant_description)
            formData.append("description", data.plant_description);
        formData.append("plant_type", selectedPlantType.id.toString());

        const file = (data.image as FileList)?.[0];
        if (file) {
            const blob = await processFile(file);
            if (blob) formData.append("plantpic", blob, file.name);
        }

        try {
            const res = await plantsApi.editPlant(plant.plant_uuid, formData);
            if (!res.ok) {
                setError("root", {
                    message: "Failed to update plant. Please try again.",
                });
            } else {
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            console.error(err);
            setError("root", {
                message: "Network error. Please try again later.",
            });
        }
    };

    return (
        <>
            <canvas ref={canvasRef} className="hidden" />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 sm:min-w-[400px] max-h-[70vh] overflow-y-auto pr-2"
            >
                {/* nickname */}
                <div className="space-y-1">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                        id="nickname"
                        placeholder="Enter plant nickname"
                        {...register("nickname")}
                    />
                    {errors.nickname && (
                        <p className="text-sm text-red-500">
                            {errors.nickname.message}
                        </p>
                    )}
                </div>

                {/* description */}
                <div className="space-y-1">
                    <Label htmlFor="plant_description">Description</Label>
                    <Textarea
                        id="plant_description"
                        placeholder="Optional description"
                        {...register("plant_description")}
                    />
                    {errors.plant_description && (
                        <p className="text-sm text-red-500">
                            {errors.plant_description.message}
                        </p>
                    )}
                </div>

                {/* plant type */}
                <div className="space-y-1">
                    <Label htmlFor="plant_type">Type</Label>
                    <Select
                        onValueChange={(val) => setValue("plant_type", val)}
                        defaultValue={plant.plant_type}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select plant type" />
                        </SelectTrigger>
                        <SelectContent className="bg-base-100 max-h-[25vh]">
                            {plantTypes.length > 0 ? (
                                plantTypes.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={type.plant_name}
                                    >
                                        {type.plant_name}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-neutral-400">
                                    Loading...
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                    {errors.plant_type && (
                        <p className="text-sm text-red-500">
                            {errors.plant_type.message}
                        </p>
                    )}
                </div>

                {/* image upload */}
                <div className="space-y-1">
                    <Label htmlFor="image">Image</Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setPreview(URL.createObjectURL(file));
                            else setPreview(plant.picture_url || null);
                        }}
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="preview"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    )}
                </div>

                {/* root error */}
                {errors.root && (
                    <p className="text-sm text-red-500 text-center">
                        {errors.root.message}
                    </p>
                )}

                {/* buttons */}
                <div className="flex justify-end gap-3">
                    <DialogClose asChild>
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </DialogClose>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Plant"}
                    </button>
                </div>
            </form>
        </>
    );
}