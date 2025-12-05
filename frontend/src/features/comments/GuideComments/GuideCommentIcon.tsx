// GuideCommentIcon.tsx (if you want to keep it)
import { MessageCircle } from "lucide-react";

export function GuideCommentIcon() {
    return (
        <div
            role="button"
            tabIndex={0}
            className="btn btn-circle bg-none border-none hover:bg-transparent hover:shadow-none cursor-pointer"
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    // Handle comment action
                }
            }}
            onClick={(e) => e.stopPropagation()}
        >
            <MessageCircle
                size={22}
                className="hover:scale-115 hover:fill-neutral hover:text-neutral transition-colors"
            />
        </div>
    );
}
