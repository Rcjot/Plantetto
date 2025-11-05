import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
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
import ConfirmDialog from "@/components/ConfirmDialog";
import type { DiaryCardType } from "./diaryTypes";
import type { UserType } from "../auth/authTypes";
import type { PlantDiaryType } from "./diaryTypes";
import { useAuthContext } from "../auth/AuthContext";
import diariesApi from "@/api/diariesApi";

interface DiaryPopupProps {
    children: React.ReactNode;
    diaryCard: DiaryCardType;
    user: UserType;
    fetchDiaries: () => void;
}

function DiaryPopup({
    children,
    diaryCard,
    user,
    fetchDiaries,
}: DiaryPopupProps) {
    const { auth } = useAuthContext()!;

    const [diaryContent, setDiaryContent] = useState<PlantDiaryType>(
        diaryCard.diaries[0]
    );
    const [currentCarouselIndex, setCarouselIndex] = useState(0);
    function setCurrentDiaryContent(index: number) {
        setDiaryContent(diaryCard.diaries[index]);
    }
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    async function onDelete() {
        await diariesApi.deleteDiaryEntry(diaryContent.uuid);
        fetchDiaries();
        setCarouselIndex(0);
        setOpen(false);
    }

    useEffect(() => {
        setDiaryContent(diaryCard.diaries[0]);
        setCarouselIndex(0);
    }, [diaryCard]);

    function handleEdit({
        editedDiaryContent,
        type,
    }: {
        editedDiaryContent: PlantDiaryType | null;
        type: "save" | "cancel";
    }) {
        if (editedDiaryContent && type == "save") {
            fetchDiaries();
        }
        setIsEdit(false);
    }

    // console.log(diaryCard);
    if (!diaryCard.user || !diaryCard.user) return <div>loading..</div>;

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>{children}</DialogTrigger>
                <DialogContent className="flex flex-col bg-yellow-50 rounded-lg shadow-lg min-w-fit  w-[80vw] md:!min-w-[50vw] md:w-[50vw] [&>button]:hidden">
                    <div className="flex self-end">
                        {auth.user?.id === diaryCard.user.id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="!bg-neutral/0 !hover:bg-neutral/0 p-0">
                                        <MoreHorizontal className="w-6 h-6" />
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
                                    <DropdownMenuItem
                                        className="hover:!bg-red-500 hover:!text-white transition-colors duration-200"
                                        onClick={() => {
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <DialogClose asChild>
                            <Button className="!bg-neutral/0">
                                <X className="w-7 h-7 sm:w-7 sm:h-7 text-gray-600" />
                            </Button>
                        </DialogClose>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6">
                        {isEdit ? (
                            <DiaryEditDialogContent
                                diaryContent={diaryContent}
                                onEdit={handleEdit}
                            />
                        ) : (
                            <DiaryViewDialogContent
                                diaryContent={diaryContent}
                                diaries={diaryCard.diaries}
                                setCurrentDiaryContent={setCurrentDiaryContent}
                                user={user}
                                currentIndex={currentCarouselIndex}
                                setCurrentIndex={setCarouselIndex}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <ConfirmDialog
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={onDelete}
            />
        </>
    );
}

export default DiaryPopup;