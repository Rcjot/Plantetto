import { Dialog, DialogContent } from "@/components/ui/dialog";
//will change this to SVG later
import { X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GardenCardDetailsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    image: string;
    title: string;
    type?: string;
    description?: string;
}

export default function GardenCard_Details({
    open,
    onOpenChange,
    image,
    title,
    type = "Unknown Type",
    description = "No description available.",
}: GardenCardDetailsProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="h-[90vh] max-h-[90vh] bg-base-100 p-0 overflow-hidden [&>button]:hidden"
                style={{
                    width: "50vw",
                    maxWidth: "50vw",
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] h-full relative">
                    {/* image side */}
                    <div className="w-full h-full bg-gray-100 overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* detail side */}
                    <div className="flex flex-col justify-start relative p-4 sm:p-6 pt-10 overflow-y-auto">
                        {/* buttons */}
                        <div className="absolute top-2 right-2 flex gap-1 sm:gap-2 items-center">
                            {/* edit, should be hidden if not the user is watching*/}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="w-10 h-10  bg-neutral/0 border border-gray-300 transition-all duration-200 hover:rounded-lg hover:bg-neutral-300 hover:border-0"
                                    >
                                        <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-base-100">
                                    <DropdownMenuItem className="hover:!bg-neutral-300 hover:!text-neutral-800 transition-colors duration-200">
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className=" hover:!bg-red-500 hover:!text-white transition-colors duration-200">
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* close*/}
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
                                    {title}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">
                                    Plant Type
                                </p>
                                <p className="text-lg font-semibold break-words">
                                    {type}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">
                                    Description
                                </p>
                                <p className="text-gray-700 whitespace-pre-line break-words">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
