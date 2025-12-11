import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import UserPlantSelect from "./UserPlantSelect";
import diariesApi from "@/api/diariesApi";
import { useEffect, useState } from "react";
import type { DiaryMediaType } from "./diaryTypes";
import plantPlaceHolder from "@/assets/plant_placeholder.png";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const schema = z.object({
    note: z.string().nonempty("required"),
    plant_id: z.string().nonempty("required"),
    media: z.any().optional(),
});
export type DiaryFields = z.infer<typeof schema>;
type DiaryFieldNames = keyof DiaryFields;

function DiaryAddForm({ onSubmitCallback }: { onSubmitCallback: () => void }) {
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
            let invalid = false;
            if (file) {
                if (
                    !file.type.startsWith("image/") &&
                    !file.type.startsWith("video/")
                ) {
                    toast.warn("Please select an image or video file.");
                    invalid = true;
                }
                if (file.size > 10 * 1024 * 1024) {
                    toast.warn("File size must be less than 10MB.");
                    invalid = true;
                }
            }
            if (invalid) {
                return;
            }
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
        if (data.media && data.media.length > 0) {
            formData.append("media", data.media[0]);
        }
        const res = await diariesApi.addDiaryEntry(formData);
        if (!res.ok) {
            (
                Object.entries(res.errors) as [DiaryFieldNames, string[]][]
            ).forEach(([field, messages]) => {
                setError(field, { message: messages[0] });
            });
        } else {
            onSubmitCallback();
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-6 w-full min-w-fit"
        >
            <div className="w-full md:w-1/2">
                {/* image upload */}
                <label className="flex flex-col items-center justify-center w-full md:h-[65vh] cursor-pointer bg-base-200">
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] min-w-[30%]">
                        {preview.media_url ? (
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
                        ) : (
                            <img src={plantPlaceHolder} alt="plant" />
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
                    {dayjs().format("YYYY MMMM D")}
                </div>
            </div>

            <div className="w-full md:w-1/2 flex-1 flex flex-col justify-between">
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
                            className="w-full h-[25vh] bg-base-100 textarea"
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

export default DiaryAddForm;
