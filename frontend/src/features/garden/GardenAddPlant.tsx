import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

export default function GardenAddPlant() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    className="w-[200px]"
                    variant="default"
                >
                    Add plant
                </Button>
            </DialogTrigger>

            {/* dialog content */}
            <DialogContent className="sm:max-w-md bg-base-100">
                <DialogHeader>
                    <DialogTitle>Add New Plant</DialogTitle>
                    <DialogDescription>
                        Fill out the details below to add a plant to your
                        garden.
                    </DialogDescription>
                </DialogHeader>

                {/* form */}
                <div className="space-y-4 mt-4">
                    <div className="w-32 h-32 bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded-md mx-auto cursor-pointer hover:bg-gray-50 transition">
                        Add Image
                    </div>

                    <div>
                        <Input placeholder="Enter plant title" />
                    </div>

                    <div>
                        <Textarea placeholder="Enter plant description" />
                    </div>

                    <div>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select plant type" />
                            </SelectTrigger>
                            <SelectContent className="bg-base-100">
                                <SelectItem value="bonsai">Bonsai</SelectItem>
                                <SelectItem value="succulent">
                                    Succulent
                                </SelectItem>
                                <SelectItem value="cactus">Cactus</SelectItem>
                                <SelectItem value="herb">Herb</SelectItem>
                                <SelectItem value="fern">Fern</SelectItem>
                                <SelectItem value="flowering">
                                    Flowering
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* save and camcel */}
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-gray-300 text-gray-600"
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => setOpen(false)}>Save</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
