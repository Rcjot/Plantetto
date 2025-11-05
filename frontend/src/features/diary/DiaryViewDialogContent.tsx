import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import MediaCarousel from "@/components/MediaCarousel";
import type { PlantDiaryType } from "./diaryTypes";
import type { UserType } from "../auth/authTypes";
import dayjs from "dayjs";

interface DiaryViewDialogContentProps {
    diaryContent: PlantDiaryType;
    diaries: PlantDiaryType[];
    user: UserType;
    setCurrentDiaryContent: (index: number) => void;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

function DiaryViewDialogContent({
    diaryContent,
    diaries,
    setCurrentDiaryContent,
    currentIndex,
    setCurrentIndex,
}: DiaryViewDialogContentProps) {
    return (
        <>
            {/* image */}
            <DialogTitle className="hidden">Display Diary</DialogTitle>
            <DialogDescription className="hidden">
                Display Diary
            </DialogDescription>

            <div className="flex flex-col md:flex-row w-full h-full gap-2">
                <div className="flex-[4] flex flex-col p-2">
                    {/* <img
                    src={image}
                    alt="Plant"
                    className="w-full h-full md:h-[65vh] object-cover rounded-xl shadow-md"
                /> */}
                    <MediaCarousel
                        mediaList={diaries}
                        setContent={setCurrentDiaryContent}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                    />
                    <div className="mt-2 text-neutral-600 font-medium text-left">
                        {dayjs(diaryContent.created_at).format("YYYY MMMM D")}
                    </div>
                </div>

                {/* text + el titulo */}
                <div className="flex-[2] flex flex-col justify-start p-4 min-w-0 break-words whitespace-pre-wrap">
                    <h2 className="text-2xl font-bold text-primary mb-4">
                        {diaryContent.plant}
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                        {diaryContent.note}
                    </p>
                </div>
            </div>
        </>
    );
}

export default DiaryViewDialogContent;