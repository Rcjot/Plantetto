import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DiaryForm from "./DiaryForm";
import React from "react";

interface DiaryEditFormProps {
    triggerText?: string;
}

const DiaryEditForm: React.FC<DiaryEditFormProps> = ({
    triggerText = "Edit Diary Entry",
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-neutral text-white hover:bg-primary shadow-md">
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="p-6 bg-yellow-50 rounded-lg shadow-lg !min-w-[50vw]">
                <DialogTitle className="hidden">Add Diary</DialogTitle>
                <DialogDescription className="hidden">
                    Add new diary entry
                </DialogDescription>
                <DiaryForm />
            </DialogContent>
        </Dialog>
    );
};

export default DiaryEditForm;