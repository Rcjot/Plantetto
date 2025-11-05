import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DiaryForm from "./DiaryForm";

function DiaryEditDialogContent() {
    return (
        <>
            <DialogTitle className="hidden">Add Diary</DialogTitle>
            <DialogDescription className="hidden">
                Add new diary entry
            </DialogDescription>
            <DiaryForm />
        </>
    );
}

export default DiaryEditDialogContent;