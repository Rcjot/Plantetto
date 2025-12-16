import type { UserType } from "@/features/auth/authTypes";
import { useEffect, useState } from "react";
import ProfilePicture from "@/components/ProfilePicture";
import { Link, useNavigate } from "react-router-dom";
import timeAgo from "@/lib/timeAgo";
import type { PlantOptionType } from "../garden/gardenTypes";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

function PostHeader({
    user,
    createdAt,
    postCaption,
    planttags,
}: {
    user: UserType;
    createdAt: string;
    postCaption: string;
    planttags: PlantOptionType[];
}) {
    const [timeDisplay, setTimeDisplay] = useState<string>(() =>
        timeAgo(createdAt)
    );
    const [expanded, setExpanded] = useState(false);
    const maxLength = 90;

    const navigate = useNavigate();

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
                    &middot;
                    {planttags.length > 0 && (
                        <HoverCard>
                            <HoverCardTrigger>
                                <p className="hover:underline">
                                    with {planttags.length} plants
                                </p>
                            </HoverCardTrigger>
                            <HoverCardContent className="bg-base-100 no-propagate">
                                <div className="flex flex-wrap gap-3">
                                    {planttags.map((p) => {
                                        return (
                                            <button
                                                onClick={() => {
                                                    navigate(
                                                        `/explore?type=${p.plant_type}`,
                                                        {
                                                            state: {
                                                                scrollTop: true,
                                                            },
                                                        }
                                                    );
                                                }}
                                                key={p.id}
                                                className="badge badge-soft badge-primary cursor-pointer"
                                            >
                                                <div
                                                    className="tooltip"
                                                    data-tip={p.plant_type}
                                                >
                                                    <p>{p.nickname}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    )}
                </div>
                <h1 className="wrap-anywhere whitespace-pre-line">
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
