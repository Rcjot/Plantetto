import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { PlantOptionType } from "../garden/gardenTypes";
import diariesApi from "@/api/diariesApi";
import { useAuthContext } from "../auth/AuthContext";

function UserPlantSelect({
    selectedPlant,
    setSelectedPlant,
}: {
    selectedPlant: string;
    setSelectedPlant: React.Dispatch<React.SetStateAction<string>>;
}) {
    const { auth } = useAuthContext()!;
    const [plantOptions, setPlantOptions] = useState<PlantOptionType[] | null>(
        null
    );

    useEffect(() => {
        const fetchPlantOptions = async () => {
            if (!auth.user) return;
            const { ok, plantOptions } = await diariesApi.getUserPlantsOptions(
                auth.user?.username
            );
            if (ok) {
                setPlantOptions(plantOptions);
            }
        };
        fetchPlantOptions();
    }, [auth.user]);

    if (plantOptions === null) {
        return <div>loading...</div>;
    }

    if (plantOptions.length <= 0) {
        return <div>you got no plants yet</div>;
    }

    return (
        <Select value={selectedPlant} onValueChange={setSelectedPlant}>
            <SelectTrigger className="w-full mb-4 mt-4 bg-base-100">
                <SelectValue placeholder="Diary for which plant" />
            </SelectTrigger>
            <SelectContent className="bg-base-100">
                {plantOptions.map((option) => {
                    return (
                        <SelectItem
                            key={option.id}
                            className="data-[highlighted]:bg-neutral-300"
                            value={String(option.id)}
                        >
                            {option.nickname}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}

export default UserPlantSelect;
