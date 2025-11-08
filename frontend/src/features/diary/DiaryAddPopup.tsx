import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import DiaryAddForm from "./DiaryAddForm";
import React, { useState } from "react";
import { useAuthContext } from "../auth/AuthContext";
import { Edit2 } from "lucide-react";

interface DiaryAddFormProps {
    fetchDiaries: () => void;
}

const DiaryAddPopup: React.FC<DiaryAddFormProps> = ({ fetchDiaries }) => {
    const { auth } = useAuthContext()!;
    const [open, setOpen] = useState(false);

    function onSubmit() {
        fetchDiaries();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {/* add diary */}
                <div className="card card-xl h-[200px] min-w-[130px] shadow-sm bg-white flex flex-col relative cursor-pointer hover:shadow-md select-none m-1 overflow-hidden">
                    {/* placeholder img */}
                    <div
                        className="h-[80%] w-full bg-gray-100 flex items-center justify-center bg-contain bg-no-repeat bg-center scale-120 hover:scale-125 transition-transform duration-300"
                        style={{
                            backgroundImage: `url(${auth.user?.pfp_url})`,
                        }}
                    >
                        {/* put image inside here */}
                        <span className="text-6xl font-bold text-gray-400">
                            +
                        </span>
                    </div>

                    {/* gray rectangle*/}
                    <div className="absolute bottom-0 w-full h-[28%] bg-gray-300 flex items-center justify-center">
                        <span className="text-neutral-600 font-bold text-sm absolute bottom-2 mb-2">
                            Write Diary
                        </span>
                        {/* circle AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA */}
                        <div className="absolute left-[10%] bottom-[100%] translate-y-1/2 flex items-center justify-center bg-primary rounded-full w-12 h-12 border-2 border-gray-400">
                            <Edit2 className="w-7 h-7 text-base-100" />
                        </div>
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

export default DiaryAddPopup;
