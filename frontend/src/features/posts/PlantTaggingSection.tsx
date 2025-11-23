import { useEffect, useState } from "react";
import type { PlantOptionType } from "../garden/gardenTypes";
import diariesApi from "@/api/diariesApi";
import { useAuthContext } from "../auth/AuthContext";
import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
// import { BadgeX } from "lucide-react";
// import { Clover } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function PlantTagSelect({
    plants,
    onSelectCB,
}: {
    plants: PlantOptionType[];
    onSelectCB: (p: PlantOptionType) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between hover:bg-base-300"
                >
                    {"Tag your plants..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {plants.map((plant) => (
                                <CommandItem
                                    key={plant.id}
                                    value={plant.id}
                                    onSelect={() => {
                                        setValue(plant.id);
                                        onSelectCB(plant);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === plant.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {plant.nickname}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

interface PlantTaggingSectionProps {
    plantTags: PlantOptionType[];
    setPlantTags: React.Dispatch<React.SetStateAction<PlantOptionType[]>>;
}

function PlantTaggingSection({
    plantTags,
    setPlantTags,
}: PlantTaggingSectionProps) {
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

    function onSelect(plant: PlantOptionType) {
        if (plantTags.find((p) => p.id == plant.id)) return;
        setPlantTags((prev) => [...prev, plant]);
    }

    if (plantOptions === null) {
        return <div>loading...</div>;
    }
    return (
        <div className="mt-auto">
            <PlantTagSelect plants={plantOptions} onSelectCB={onSelect} />
        </div>
    );
}

export default PlantTaggingSection;
