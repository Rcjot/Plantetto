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

function GuidesEditor() {
    const { uuid } = useParams()!;
    const guide = useFetchGuide(uuid);

    const [title, setTitle] = useState<string>("");
    const [plantTypes, setPlantTypes] = useState<PlanttypeType[]>([]);
    const [selectValue, setSelectValue] = useState<string>("");

    useEffect(() => {
        if (guide) {
            setTitle(guide.title);
            if (guide.plant_type.id) {
                setSelectValue(String(guide.plant_type.id));
            }
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

    if (!guide) return <div>loading..</div>;

    return (
        <div className="flex items-center justify-center">
            <div className="myEditor flex flex-col items-center gap-3  p-5 w-fit">
                <SimpleEditor passedContent={guide.content}>
                    <input
                        type="text"
                        className="input input-xl input-ghost font-bold "
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="space-y-1">
                        <Label htmlFor="plant_type_id">Type</Label>
                        <Select
                            onValueChange={(val) => setSelectValue(val)}
                            value={selectValue}
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
                    </div>
                </SimpleEditor>
            </div>
        </div>
    );
}

export default GuidesEditor;
