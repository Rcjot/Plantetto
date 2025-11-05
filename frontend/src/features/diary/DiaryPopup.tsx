import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";
import { X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DiaryEditDialogContent from "./DiaryEditDialogContent";
import DiaryViewDialogContent from "./DiaryViewDialogContent";
import type { DiaryCardType } from "./diaryTypes";
import type { UserType } from "../auth/authTypes";

interface DiaryPopupProps {
    children: React.ReactNode;
    diaryCard: DiaryCardType;
    user: UserType;
}

function DiaryPopup({ children, diaryCard, user }: DiaryPopupProps) {
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="flex flex-col p-6 bg-yellow-50 rounded-lg shadow-lg min-w-fit w-[80vw] md:w-[50vw] min-h-fit [&>button]:hidden">
                <div className="flex gap-3 self-end">
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
                                    setIsEdit(true); // open edit modal
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:!bg-red-500 hover:!text-white transition-colors duration-200">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 bg-base-100 border border-gray-300 transition-all duration-200 hover:rounded-lg hover:bg-warning hover:border-0"
                        onClick={() => setOpen(false)}
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                    {isEdit ? (
                        <DiaryEditDialogContent />
                    ) : (
                        <DiaryViewDialogContent />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DiaryPopup;