import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import plantsApi from "@/api/plantsApi";
import type { PlanttypeType } from "@/features/garden/gardenTypes";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";

const schema = z.object({
    nickname: z
        .string()
        .nonempty("required")
        .max(50, "less than 50 characters please"),
    plant_description: z.string().optional(),
    plant_type_id: z.string().nonempty("required"),
    image: z.any().optional(),
});

export type GardenFormFields = z.infer<typeof schema>;

export default function GardenForm({
    onSuccess,
    setSubmitting,
}: {
    onSuccess?: () => void;
    setSubmitting?: (val: boolean) => void;
}) {
    const [plantTypes, setPlantTypes] = useState<PlanttypeType[]>([]);
    const [preview, setPreview] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<GardenFormFields>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        setSubmitting?.(isSubmitting);
    }, [isSubmitting, setSubmitting]);

    useEffect(() => {
        async function loadPlantTypes() {
            const res = await plantsApi.fetchPlantTypes();
            if (res.ok && res.plant_types) setPlantTypes(res.plant_types);
            else setPlantTypes([]);
        }
        loadPlantTypes();
    }, []);

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
                canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
            };
        });
    };

    const onSubmit: SubmitHandler<GardenFormFields> = async (data) => {
        const file = (data.image as FileList)?.[0];
        if (!file) {
            setError("image", { type: "manual", message: "Image is required" });
            return;
        }

        const formData = new FormData();
        formData.append("nickname", data.nickname);
        if (data.plant_description)
            formData.append("description", data.plant_description);
        formData.append("plant_type", data.plant_type_id);

        const blob = await processFile(file);
        if (blob) formData.append("plantpic", blob, file.name);

        const res = await plantsApi.addPlant(formData);

        if (!res.ok) {
            setError("root", {
                message: "Failed to add plant. Please try again.",
            });
        } else {
            reset();
            setPreview(null);
            onSuccess?.();
        }
    };

    return (
        <>
            <canvas ref={canvasRef} className="hidden" />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 sm:min-w-[400px]"
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
                        <p
                            className="text-sm text-warning-content
                        "
                        >
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
                </div>

                {/* plant type */}
                <div className="space-y-1">
                    <Label htmlFor="plant_type_id">Type</Label>
                    <Select
                        onValueChange={(val) => setValue("plant_type_id", val)}
                        defaultValue=""
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select plant type" />
                        </SelectTrigger>
                        <SelectContent className="bg-base-100 max-h-[25vh]">
                            {plantTypes.length > 0 ? (
                                plantTypes.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={String(type.id)}
                                        className="data-[highlighted]:bg-neutral-200"
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
                    {errors.plant_type_id && (
                        <p
                            className="text-sm text-warning-content
                        "
                        >
                            {errors.plant_type_id.message}
                        </p>
                    )}
                </div>

                {/* image upload with React Hook Form custom validate */}
                <div className="space-y-1">
                    <Label htmlFor="image">Image</Label>
                    <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        {...register("image", {
                            validate: (files: FileList) =>
                                (files && files.length > 0) ||
                                "Image is required",
                        })}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setPreview(URL.createObjectURL(file));
                            else setPreview(null);
                        }}
                    />
                    {errors.image && (
                        <p className="text-sm text-warning-content">
                            {errors.image.message as string}
                        </p>
                    )}
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
                    <p
                        className="text-sm text-warning-content
                     text-center"
                    >
                        {errors.root.message}
                    </p>
                )}

                {/* submit & cancel */}
                <div className="flex justify-end gap-3">
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
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add Plant"}
                    </button>
                </div>
            </form>
        </>
    );
}
