import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import React, { useState } from "react";
import { X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DiaryEditDialogContent from "@/features/diary/DiaryEditDialogContent";
import DiaryViewDialogContent from "@/features/diary/DiaryViewDialogContent";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { PlantDiaryType } from "@/features/diary/diaryTypes";
import { useAuthContext } from "@/features/auth/AuthContext";
import diariesApi from "@/api/diariesApi";
import useDiaryPopup2 from "../hooks/useDiaryPopup2";
import { DiaryViewIndicator } from "@/features/profile/profilediaries/components/DiaryViewingBarInicator";

interface DiaryPopupProps {
    fetchDiaries: () => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentPlant: null | {
        uuid: string;
        date: string;
    };
    setCurrentPlant: React.Dispatch<
        React.SetStateAction<{
            uuid: string;
            date: string;
        } | null>
    >;
    carouselItems: React.ReactNode;
}

function DiaryPopup2({
    fetchDiaries,
    open,
    setOpen,
    currentPlant,
    carouselItems,
}: DiaryPopupProps) {
    const { auth } = useAuthContext()!;
    const {
        currentCarouselIndex,
        setCarouselIndex,
        diaryGroupByPlantOnDate,
        diaryContent,
        setCurrentDiaryContent,
        fetchGroup,
        datesWithEntries,
        currentDate,
        setCurrentDate,
    } = useDiaryPopup2(currentPlant);

    const [isEdit, setIsEdit] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    async function onDelete() {
        if (!diaryContent) return;
        setDeleteLoading(true);
        await diariesApi.deleteDiaryEntry(diaryContent.uuid);
        fetchDiaries();
        fetchGroup();
        setDeleteLoading(false);
        setCarouselIndex(0);
        setOpen(false);
    }

    function handleEdit({
        editedDiaryContent,
        type,
    }: {
        editedDiaryContent: PlantDiaryType | null;
        type: "save" | "cancel";
    }) {
        if (editedDiaryContent && type == "save") {
            fetchDiaries();
            fetchGroup();
        }
        setIsEdit(false);
    }

    if (!diaryGroupByPlantOnDate || !currentDate) return <div></div>;

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex flex-col bg-yellow-50 rounded-lg shadow-lg min-w-fit h-[70dvh]  w-[80vw] md:!min-w-[50vw] md:w-[70vw] md:min-h-[80dvh] [&>button]:hidden">
                    {/*side carousel*/}
                    <div className="absolute hidden md:block">
                        <Carousel
                            className="w-[83vw] sm:w-5/6 right-40 bottom-10 "
                            orientation="vertical"
                        >
                            <CarouselContent className="max-h-[75dvh]">
                                {carouselItems}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                    <div className="absolute md:hidden">
                        <Carousel className="w-[70vw] sm:w-5/6 -right-0 -top-35">
                            <CarouselContent>{carouselItems}</CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                    {/*edit and close button*/}
                    <div className="flex self-end">
                        {auth.user?.id === diaryGroupByPlantOnDate.user.id && (
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

                    {/* Date Navigation Indicator - Added here */}
                    <div className="w-[100%] md:w-[65%] ">
                        <DiaryViewIndicator
                            datesWithEntries={datesWithEntries}
                            currentDate={currentDate}
                            onDateChange={(newDate) => {
                                setCurrentDate(newDate);
                                // fetchGroup will be triggered by useDiaryPopup2
                            }}
                        />
                    </div>

                    {/*the content*/}
                    {diaryContent && (
                        <div className="overflow-y-auto flex-1 min-h-0 px-2 pb-4 w-full">
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                {isEdit ? (
                                    <DiaryEditDialogContent
                                        diaryContent={diaryContent}
                                        onEdit={handleEdit}
                                    />
                                ) : (
                                    <DiaryViewDialogContent
                                        diaryContent={diaryContent}
                                        diaries={
                                            diaryGroupByPlantOnDate.diaries
                                        }
                                        setCurrentDiaryContent={
                                            setCurrentDiaryContent
                                        }
                                        user={diaryGroupByPlantOnDate.user}
                                        currentIndex={currentCarouselIndex}
                                        setCurrentIndex={setCarouselIndex}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <ConfirmDialog
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={onDelete}
                loading={deleteLoading}
            />
        </>
    );
}

export default DiaryPopup2;
