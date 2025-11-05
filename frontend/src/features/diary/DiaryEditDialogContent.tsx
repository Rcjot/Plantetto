import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DiaryEditForm from "./DiaryEditForm";
import type { PlantDiaryType } from "./diaryTypes";

interface DiaryEditDialogContentProps {
    diaryContent: PlantDiaryType;
    onEdit: ({
        editedDiaryContent,
        type,
    }: {
        editedDiaryContent: PlantDiaryType | null;
        type: "save" | "cancel";
    }) => void;
}

function DiaryEditDialogContent({
    diaryContent,
    onEdit,
}: DiaryEditDialogContentProps) {
    return (
        <>
            <DialogTitle className="hidden">Edit Diary</DialogTitle>
            <DialogDescription className="hidden">
                Edit diary entry
            </DialogDescription>
            <DiaryEditForm diaryContent={diaryContent} onEdit={onEdit} />
        </>
    );
}

export default DiaryEditDialogContent;