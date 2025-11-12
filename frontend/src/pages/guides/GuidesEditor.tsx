import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import useFetchGuide from "@/features/guides/hooks/useFetchGuide";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import plantsApi from "@/api/plantsApi";
import type { PlanttypeType } from "@/features/garden/gardenTypes";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import guidesApi from "@/api/guidesApi";

function GuidesEditor() {
    const { uuid } = useParams()!;
    const guide = useFetchGuide(uuid);

    const [title, setTitle] = useState<string>("");
    const [plantTypes, setPlantTypes] = useState<PlanttypeType[]>([]);
    const [selectValue, setSelectValue] = useState<string>("");
    const [errors, setErrors] = useState<{
        title: string;
        plant_type: string;
        root: string;
    }>({
        title: "",
        plant_type: "",
        root: "",
    });

    useEffect(() => {
        if (guide) {
            setTitle(guide.title);
            setSelectValue(
                String(guide.plant_type ? guide.plant_type.id : "0")
            );
        }
    }, [guide]);

    useEffect(() => {
        async function loadPlantTypes() {
            const res = await plantsApi.fetchPlantTypes();
            if (res.ok && res.plant_types) {
                setPlantTypes(res.plant_types);
            } else {
                setPlantTypes([]);
            }
        }
        loadPlantTypes();
    }, [guide]);

    async function handleSaveMeta(newPlantType?: string) {
        if (guide) {
            newPlantType = newPlantType === "0" ? "" : newPlantType;
            const toPassSelectValue = selectValue === "0" ? "" : selectValue;

            const formData = new FormData();
            formData.append("title", title);
            formData.append("plant_type", newPlantType ?? toPassSelectValue);
            const res = await guidesApi.patchMetaGuide(guide?.uuid, formData);
            if (!res.ok) {
                const constructedErrors = {
                    title: res.errors.title[0],
                    plant_type: res.errors.plant_type[0],
                    root: res.errors.root[0],
                };
                setErrors(constructedErrors);
            } else {
                setErrors({
                    title: "",
                    plant_type: "",
                    root: "",
                });
            }
        }
    }

    if (!guide) return <div>loading..</div>;

    return (
        <div className="flex items-center justify-center">
            <div className="myEditor flex flex-col items-center gap-3  p-5 w-fit">
                <SimpleEditor passedGuide={guide}>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            className="input input-xl input-ghost font-bold "
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setErrors((prev) => ({ ...prev, title: "" }));
                            }}
                            onBlur={() => handleSaveMeta()}
                        />
                        <span className="text-warning-content">
                            {errors?.title}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="plant_type_id">Type</Label>
                        <Select
                            onValueChange={(val) => {
                                setSelectValue(val);
                                handleSaveMeta(val);
                            }}
                            value={selectValue}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select plant type" />
                            </SelectTrigger>
                            <SelectContent className="bg-base-100 max-h-[25vh]">
                                <SelectItem value="0">general</SelectItem>
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
                        <span className="text-warning-content">
                            {errors?.plant_type}
                        </span>
                    </div>
                </SimpleEditor>
                <span className="text-warning-content">{errors?.root}</span>
            </div>
        </div>
    );
}

export default GuidesEditor;
