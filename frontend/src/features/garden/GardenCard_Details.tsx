import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GardenFormEdit from "./GardenFormEdit";
import type { PlantType } from "@/features/garden/gardenTypes";
import GardenDelete from "./GardenDelete";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../auth/AuthContext";

interface GardenCardDetailsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plant: PlantType;
    // optionally pass a callback to refresh garden grid after edit/delete
    onUpdated?: () => void;
}

export default function GardenCard_Details({
    open,
    onOpenChange,
    plant,
    onUpdated,
}: GardenCardDetailsProps) {
    const { username } = useParams();
    const { auth } = useAuthContext()!;
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const isOwner = !username ? true : auth.user?.username === username;
    return (
        <>
            {/* Details Dialog */}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className="h-[90vh] max-h-[90vh] bg-base-100 p-0 overflow-hidden [&>button]:hidden"
                    style={{
                        width: "50vw",
                        maxWidth: "50vw",
                    }}
                >
                    <DialogTitle className="sr-only">
                        {plant.nickname}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {plant.description}
                    </DialogDescription>

                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] h-full relative">
                        {/* image side */}
                        <div className="relative w-full h-full bg-gray-200 overflow-hidden">
                            {/* background blur */}
                            <div
                                className="absolute inset-0 bg-center bg-cover blur-lg scale-110 brightness-50"
                                style={{
                                    backgroundImage: `url(${plant.picture_url})`,
                                }}
                            />
                            <div className="absolute inset-0 bg-black/20" />

                            {/* main image */}
                            <img
                                src={plant.picture_url}
                                alt={plant.nickname}
                                className="relative z-10 object-contain w-full h-full"
                            />
                        </div>

                        {/* detail side */}
                        <div className="flex flex-col justify-start relative p-4 sm:p-6 pt-10 overflow-y-auto">
                            {/* buttons */}
                            <div className="absolute top-2 right-2 flex gap-1 sm:gap-2 items-center">
                                {/* edit, delete dropdown */}
                                {isOwner && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="w-10 h-10 bg-neutral/0 border border-gray-300 transition-all duration-200 hover:rounded-lg hover:bg-neutral-300 hover:border-0"
                                            >
                                                <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-base-100">
                                            <DropdownMenuItem
                                                className="hover:!bg-neutral-300 hover:!text-neutral-800 transition-colors duration-200"
                                                onClick={() => {
                                                    setEditOpen(true); // open edit modal
                                                    onOpenChange(false); // close details modal
                                                }}
                                            >
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="hover:!bg-yellow-500 hover:!text-white transition-colors duration-200
                                        "
                                                onClick={() => {
                                                    setDeleteOpen(true);
                                                    onOpenChange(false);
                                                }}
                                            >
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                {/* close button */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-10 h-10 bg-base-100 border border-gray-300 transition-all duration-200 hover:rounded-lg hover:bg-warning hover:border-0"
                                    onClick={() => onOpenChange(false)}
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </Button>
                            </div>

                            {/* plant details */}
                            <div className="flex flex-col flex-1 space-y-4 text-sm sm:text-base">
                                <div>
                                    <p className="text-gray-500 font-medium">
                                        Plant Name
                                    </p>
                                    <p className="text-lg font-semibold break-words">
                                        {plant.nickname}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">
                                        Plant Type
                                    </p>
                                    <p className="text-lg font-semibold break-words">
                                        {plant.plant_type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-medium">
                                        Description
                                    </p>
                                    <p className="text-gray-700 whitespace-pre-line break-words">
                                        {plant.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* edit dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md bg-base-100">
                    <DialogTitle>Edit Plant</DialogTitle>
                    <DialogDescription>
                        Edit the details of your plant
                    </DialogDescription>
                    <GardenFormEdit
                        plant={plant}
                        onSuccess={() => {
                            setEditOpen(false);
                            onUpdated?.(); // refresh garden grid if needed
                        }}
                        onClose={() => setEditOpen(false)}
                    />
                </DialogContent>
            </Dialog>
            <GardenDelete
                plant_uuid={plant.plant_uuid}
                plant_nickname={plant.nickname}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                onDeleted={() => {
                    setDeleteOpen(false);
                    onUpdated?.();
                }}
            />
        </>
    );
}
