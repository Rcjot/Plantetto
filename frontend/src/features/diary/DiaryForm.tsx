import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import UserPlantSelect from "./UserPlantSelect";
import diariesApi from "@/api/diariesApi";
import { useEffect, useState } from "react";
import type { DiaryMediaType } from "./diaryTypes";

const schema = z.object({
    note: z.string().nonempty("required"),
    plant_id: z.string().nonempty("required"),
    media: z.any().optional(),
});
export type DiaryFields = z.infer<typeof schema>;
type DiaryFieldNames = keyof DiaryFields;

function DiaryForm() {
    const [preview, setPreview] = useState<DiaryMediaType>({
        media_url: null,
        media_type: null,
    });

    const {
        control,
        register,
        watch,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<DiaryFields>({
        defaultValues: { plant_id: "" },
        resolver: zodResolver(schema),
    });

    const mediaFile = watch("media");

    useEffect(() => {
        if (mediaFile && mediaFile.length > 0) {
            const file = mediaFile[0];

            setPreview({
                media_url: URL.createObjectURL(file),
                media_type: file.type.startsWith("image") ? "image" : "video",
            });
        } else {
            setPreview({
                media_url: null,
                media_type: null,
            });
        }
    }, [mediaFile]);

    const onSubmit: SubmitHandler<DiaryFields> = async (data) => {
        const formData = new FormData();
        formData.append("note", data.note);
        formData.append("plant_id", data.plant_id);
        console.log(data.media, data.media.length);
        if (data.media && data.media.length > 0) {
            formData.append("media", data.media[0]);
            console.log("hii");
        }
        console.log(data);
        const res = await diariesApi.addDiaryEntry(formData);
        if (!res.ok) {
            (
                Object.entries(res.errors) as [DiaryFieldNames, string[]][]
            ).forEach(([field, messages]) => {
                setError(field, { message: messages[0] });
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-6 p-6 w-full min-w-fit"
        >
            <div className="min-w-[50%]">
                {/* image upload */}
                <label className="flex flex-col items-center justify-center w-full md:h-[65vh] cursor-pointer bg-neutral-300">
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] min-w-[30%]">
                        {preview.media_url && (
                            <>
                                {preview.media_type === "image" ? (
                                    <img
                                        src={preview.media_url}
                                        className="w-full h-full md:h-[65vh] object-cover rounded-xl shadow-md"
                                    />
                                ) : (
                                    <video>
                                        <source src={preview.media_url} />
                                    </video>
                                )}
                            </>
                        )}
                    </div>
                    <span className="text-warning-content">
                        {errors.plant_id?.message}
                    </span>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        {...register("media")}
                        className="hidden"
                    />
                </label>

                {/* date */}
                <div className="mt-2 text-neutral-600 font-medium self-start">
                    2024 June 27
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {/* dropdpown*/}
                    <div>
                        <span className="text-warning-content">
                            {errors.plant_id?.message}
                        </span>
                        <Controller
                            name="plant_id"
                            control={control}
                            render={({ field }) => (
                                <UserPlantSelect
                                    selectedPlant={field.value}
                                    setSelectedPlant={field.onChange}
                                />
                            )}
                        />
                    </div>

                    {/* description */}
                    <div>
                        <span className="text-warning-content">
                            {errors.note?.message}
                        </span>
                        <textarea
                            {...register("note")}
                            placeholder="whats up mananap"
                            className="h-[200px] bg-base-100 textarea"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    {/* hardcoded color for now */}
                    <button
                        type="submit"
                        className="btn btn-neutral hover:bg-primary text-white"
                    >
                        {isSubmitting ? "Adding..." : "Add Entry"}
                    </button>
                </div>
            </div>
            <span className="text-warning-content">{errors.root?.message}</span>
        </form>
    );
}

export default DiaryForm;
