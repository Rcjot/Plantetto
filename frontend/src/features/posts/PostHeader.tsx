import type { UserType } from "@/features/auth/authTypes";
import { useEffect, useState } from "react";
import ProfilePicture from "@/components/ProfilePicture";
import { Link } from "react-router-dom";

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds >= 31536000) {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    if (seconds >= 86400) {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    const intervals = {
        h: 3600,
        min: 60,
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const diff = Math.floor(seconds / value);
        if (diff >= 1) return `${diff}${unit}`;
    }

    return "just now";
}

function PostHeader({
    user,
    createdAt,
    postCaption,
}: {
    user: UserType;
    createdAt: string;
    postCaption: string;
}) {
    const [timeDisplay, setTimeDisplay] = useState<string>(() =>
        timeAgo(createdAt)
    );
    const [expanded, setExpanded] = useState(false);
    const maxLength = 90;

    const isTruncated = postCaption.length > maxLength;
    const displayText = expanded
        ? postCaption
        : postCaption.slice(0, maxLength) + (isTruncated ? " ..." : "");

    useEffect(() => {
        const interval = setInterval(
            () => setTimeDisplay(timeAgo(createdAt)),
            6000
        );
        return () => clearInterval(interval);
    }, [createdAt]);

    return (
        <div className="flex gap-3">
            <Link
                to={`/${user.username}`}
                className="h-fit w-fit"
                onClick={(e) => e.stopPropagation()}
            >
                <ProfilePicture src={user.pfp_url} />
            </Link>
            <div className="flex flex-col gap-1 ">
                <div className="flex items-center gap-3 flex-wrap gap-x-2 gap-y-1 min-w-0">
                    <Link
                        to={`/${user.username}`}
                        onClick={(e) => e.stopPropagation()}
                        className="h-fit w-fit"
                    >
                        <span className="font-[1000] h-fit hover:underline cursor-pointer">
                            {user.display_name ?? user.username}
                        </span>
                    </Link>
                    <Link
                        to={`/${user.username}`}
                        onClick={(e) => e.stopPropagation()}
                        className="h-fit w-fit"
                    >
                        <p className="text-[#525252] hover:underline cursor-pointer">
                            @{user.username}
                        </p>
                    </Link>
                    &middot;
                    <p className="hover:underline cursor-pointer">
                        {timeDisplay}
                    </p>
                </div>
                <h1 className="wrap-anywhere">
                    {displayText}
                    {isTruncated && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(!expanded);
                            }}
                            className="text-[#525252] hover:underline ml-3"
                        >
                            {expanded ? "Show less" : "Read more"}
                        </button>
                    )}
                </h1>
            </div>
        </div>
    );
}

export default PostHeader;
