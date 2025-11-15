import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

function ConfirmDialog({
    open,
    setOpen,
    onConfirm,
    loading,
    text,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => Promise<void>;
    loading: boolean;
    text?: string;
}) {
    text = text ? text : "Are you sure to do action?";
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-base-100 no-propagate">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            Confirm Action
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            {text}
                        </DialogDescription>
                        <div className="flex gap-2 justify-center">
                            <button
                                className="btn btn-warning"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    await onConfirm();
                                    setOpen(false);
                                }}
                            >
                                {loading ? "loading..." : "Yes"}
                            </button>
                            <button
                                className="btn btn-neutral"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(false);
                                }}
                            >
                                No
                            </button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ConfirmDialog;
