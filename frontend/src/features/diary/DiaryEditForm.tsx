import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import UserPlantSelect from "./UserPlantSelect";
import diariesApi from "@/api/diariesApi";
import { useEffect, useState } from "react";
import type { DiaryMediaType, PlantDiaryType } from "./diaryTypes";
import plantPlaceHolder from "@/assets/plant_placeholder.png";
import dayjs from "dayjs";

const schema = z.object({
    note: z.string().nonempty("required"),
    plant_id: z.string().nonempty("required"),
    media: z.any().optional(),
});
export type DiaryFields = z.infer<typeof schema>;
type DiaryFieldNames = keyof DiaryFields;

interface DiaryEditFormProps {
    diaryContent: PlantDiaryType;
    onEdit: ({
        editedDiaryContent,
        type,
    }: {
        editedDiaryContent: PlantDiaryType | null;
        type: "save" | "cancel";
    }) => void;
}

function DiaryEditForm({ diaryContent, onEdit }: DiaryEditFormProps) {
    const [preview, setPreview] = useState<DiaryMediaType>({
        media_url: diaryContent.media_url,
        media_type: diaryContent.media_type,
    });

    const {
        control,
        register,
        watch,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<DiaryFields>({
        defaultValues: {
            plant_id: String(diaryContent.plant_id),
            note: diaryContent.note,
        },
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
        const res = await diariesApi.editDiaryEntry(
            formData,
            diaryContent.uuid
        );
        if (!res.ok || !res.diary) {
            (
                Object.entries(res.errors) as [DiaryFieldNames, string[]][]
            ).forEach(([field, messages]) => {
                setError(field, { message: messages[0] });
            });
        } else {
            onEdit({ editedDiaryContent: res.diary, type: "save" });
        }
    };

    console.log(preview);
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:flex-row gap-6 p-6 w-full min-w-fit"
        >
            <div className="min-w-[50%]">
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
                                    <video key={preview.media_url}>
                                        <source src={preview.media_url} />
                                    </video>
                                )}
                            </>
                        ) : (
                            <img src={plantPlaceHolder} alt="plant" />
                        )}
                    </div>
                    <span className="text-warning">
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
                    {dayjs(diaryContent.created_at).format("YYYY MMMM D")}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {/* dropdpown*/}
                    <div>
                        <span className="text-warning">
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
                        <span className="text-warning">
                            {errors.note?.message}
                        </span>
                        <textarea
                            {...register("note")}
                            placeholder="whats up mananap"
                            className="h-[200px] bg-base-100 textarea"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                    {/* hardcoded color for now */}
                    <button
                        type="button"
                        className="btn btn-warning"
                        onClick={() => {
                            onEdit({
                                editedDiaryContent: null,
                                type: "cancel",
                            });
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-neutral hover:bg-primary text-white"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
            <span className="text-warning">{errors.root?.message}</span>
        </form>
    );
}

export default DiaryEditForm;