import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import image from "@/assets/image.png";

function DiaryViewDialogContent() {
    return (
        <>
            {/* image */}
            <DialogTitle className="hidden">Display Diary</DialogTitle>
            <DialogDescription className="hidden">
                Display Diary
            </DialogDescription>

            <div className="w-full md:w-[300px] flex-shrink-0 flex flex-col">
                <img
                    src={image}
                    alt="Plant"
                    className="w-full h-full md:h-[65vh] object-cover rounded-xl shadow-md"
                />
                <div className="mt-2 text-neutral-600 font-medium text-left">
                    2024 June 27
                </div>
            </div>

            {/* text + el titulo */}
            <div className="flex-1 flex flex-col justify-start min-w-[200px]">
                <h2 className="text-2xl font-bold text-primary mb-4">
                    My Stock Flower
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                    The stock flower has grown noticeably taller, with sturdy
                    stems and healthy green leaves. After watering today, the
                    soil feels fresh and the plant looks vibrant.
                </p>
            </div>
        </>
    );
}

export default DiaryViewDialogContent;