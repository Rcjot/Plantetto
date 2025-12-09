import Pointing_Right_Light from "@/assets/pointing_right_leaf_button.svg";
import Pointing_Right_Dark from "@/assets/pointing_right_leaf_button_dark.svg";
import Pointing_Left_Light from "@/assets/pointing_left_leaf_button.svg";
import Pointing_Left_Dark from "@/assets/pointing_left_leaf_button_dark.svg";

interface DiaryViewIndicatorProps {
    datesWithEntries: { date: string }[];
    currentDate: string | null;
    onDateChange: (date: string) => void;
}

export function DiaryViewIndicator({
    datesWithEntries,
    currentDate,
    onDateChange,
}: DiaryViewIndicatorProps) {
    const handlePrevious = () => {
        if (!currentDate || datesWithEntries.length === 0) return;

        const currentIndex = datesWithEntries.findIndex(
            (d) => d.date === currentDate
        );
        if (currentIndex > 0) {
            onDateChange(datesWithEntries[currentIndex - 1].date);
        }
    };

    const handleNext = () => {
        if (!currentDate || datesWithEntries.length === 0) return;

        const currentIndex = datesWithEntries.findIndex(
            (d) => d.date === currentDate
        );
        if (currentIndex < datesWithEntries.length - 1) {
            onDateChange(datesWithEntries[currentIndex + 1].date);
        }
    };

    const handleDateClick = (date: string) => {
        onDateChange(date);
    };

    const formatDateDisplay = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    // Get visible dates (max 5 around current)
    const getVisibleDates = () => {
        if (datesWithEntries.length <= 5) {
            return datesWithEntries;
        }

        if (!currentDate) return datesWithEntries.slice(0, 5);

        const currentIndex = datesWithEntries.findIndex(
            (d) => d.date === currentDate
        );
        if (currentIndex === -1) return datesWithEntries.slice(0, 5);

        const start = Math.max(0, currentIndex - 2);
        const end = Math.min(datesWithEntries.length, start + 5);

        return datesWithEntries.slice(start, end);
    };

    if (datesWithEntries.length === 0) {
        return (
            <div className="join w-full">
                <div className="flex w-full items-center justify-center py-4">
                    <span className="text-sm text-gray-500">
                        No diary entries found
                    </span>
                </div>
            </div>
        );
    }

    const visibleDates = getVisibleDates();

    return (
        <div className="join w-full">
            <div className="flex w-full items-center">
                {/* Left arrow button */}
                <button
                    className="flex-shrink-0 p-2 hover:bg-transparent group bg-transparent border-none shadow-none hover:shadow-none disabled:opacity-30"
                    onClick={handlePrevious}
                    disabled={
                        !currentDate ||
                        datesWithEntries.findIndex(
                            (d) => d.date === currentDate
                        ) === 0
                    }
                    aria-label="Previous date"
                >
                    <div className="relative w-10 h-10 cursor-pointer">
                        <img
                            src={Pointing_Left_Light}
                            alt="Previous"
                            className="w-full h-full object-contain absolute inset-0 group-hover:opacity-0 transition-all duration-200"
                        />
                        <img
                            src={Pointing_Left_Dark}
                            alt="Previous"
                            className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-115 transition-all duration-200 origin-center"
                        />
                    </div>
                </button>

                {/* Date items */}
                <div className="flex flex-1 min-w-0">
                    {visibleDates.map((dateItem) => {
                        const isActive = dateItem.date === currentDate;

                        return (
                            <div
                                key={dateItem.date}
                                className="flex flex-col items-center justify-center flex-1 min-w-0 px-1 group/date hover:scale-105 transition-transform duration-200 origin-center cursor-pointer"
                                onClick={() => handleDateClick(dateItem.date)}
                            >
                                <div
                                    className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis group-hover/date:font-semibold transition-all duration-200 ${isActive ? "font-bold text-primary" : "text-gray-600"}`}
                                >
                                    {formatDateDisplay(dateItem.date)}
                                </div>
                                <button
                                    className={`h-3 rounded-full w-full mt-1 group-hover/date:scale-105 transition-transform duration-200 origin-center ${isActive ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"}`}
                                ></button>
                            </div>
                        );
                    })}
                </div>

                {/* Right arrow button */}
                <button
                    className="flex-shrink-0 p-2 hover:bg-transparent group bg-transparent border-none shadow-none hover:shadow-none disabled:opacity-30"
                    onClick={handleNext}
                    disabled={
                        !currentDate ||
                        datesWithEntries.findIndex(
                            (d) => d.date === currentDate
                        ) ===
                            datesWithEntries.length - 1
                    }
                    aria-label="Next date"
                >
                    <div className="relative w-10 h-10 cursor-pointer">
                        <img
                            src={Pointing_Right_Light}
                            alt="Next"
                            className="w-full h-full object-contain absolute inset-0 group-hover:opacity-0 transition-all duration-200"
                        />
                        <img
                            src={Pointing_Right_Dark}
                            alt="Next"
                            className="w-full h-full object-contain absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-115 transition-all duration-200 origin-center "
                        />
                    </div>
                </button>
            </div>
        </div>
    );
}
