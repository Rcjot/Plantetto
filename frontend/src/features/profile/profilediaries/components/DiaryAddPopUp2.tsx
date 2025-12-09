import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import DiaryAddForm from "@/features/diary/DiaryAddForm";
import React, { useState } from "react";
import { useAuthContext } from "@/features/auth/AuthContext";
import { Plus } from "lucide-react";

interface DiaryAddFormProps {
    fetchDiaries: () => void;
}

const DiaryAddPopupCircle: React.FC<DiaryAddFormProps> = ({ fetchDiaries }) => {
    const { auth } = useAuthContext()!;
    const [open, setOpen] = useState(false);

    function onSubmit() {
        fetchDiaries();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="avatar mt-2 mx-2 mr-5">
                        <div className="ring-primary ring-offset-base-100 w-18 rounded-full ring-2 ring-offset-2 relative overflow-hidden hover:scale-105 transition-transform duration-300">
                            {/* User's profile picture as background */}
                            <div
                                className="w-full h-full bg-gray-100 flex items-center justify-center bg-cover bg-no-repeat bg-center"
                                style={{
                                    backgroundImage: auth.user?.pfp_url
                                        ? `url(${auth.user.pfp_url})`
                                        : "none",
                                    backgroundColor: auth.user?.pfp_url
                                        ? "transparent"
                                        : "#f3f4f6",
                                }}
                            >
                                {/* Semi-transparent overlay */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>

                                {/* Plus icon at the center */}
                                <div className="relative z-10 flex items-center justify-center">
                                    <div className="bg-primary rounded-full p-2 shadow-lg group-hover:bg-primary/90 transition-colors duration-300">
                                        <Plus className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-fit text-base-100-content text-start font-bold px-2 text-sm rounded w-fit">
                        Add Diary
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="p-6 bg-yellow-50 rounded-lg shadow-lg !min-w-[50vw]">
                <DialogTitle className="hidden">Add Diary</DialogTitle>
                <DialogDescription className="hidden">
                    Add new diary entry
                </DialogDescription>
                <DiaryAddForm onSubmitCallback={onSubmit} />
            </DialogContent>
        </Dialog>
    );
};

export default DiaryAddPopupCircle;
