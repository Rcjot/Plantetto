import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import defaultpfp from "@/assets/defaultpfp.png";
import type { MediaType } from "../posts/postTypes";

interface PostCardProps {
    avatar: string;
    username: string;
    timeAgo: string;
    caption: string;
    postMedia: MediaType | null;
    likes: number;
    onClick?: () => void;
}

export function RecentCard({
    avatar,
    username,
    timeAgo,
    caption,
    postMedia,
    likes,
    onClick,
}: PostCardProps) {
    const hasMedia = postMedia !== null && postMedia !== undefined;

    return (
        <div
            className={`w-[275px] h-[105px] shadow-sm shadow-secondary rounded-lg flex flex-row justify-between items-start p-2 gap-2 my-1 ${!hasMedia ? "justify-start" : ""} cursor-pointer hover:bg-base-200`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            {/* Left Side (Text content) */}
            <div
                className={`flex flex-col gap-1 ${hasMedia ? "w-[65%]" : "w-full"}`}
            >
                {/* Avatar + Username + • + Time */}
                <div className="flex flex-row items-center gap-2 text-[12px] text-gray-700">
                    <Link
                        to={`/${username}`}
                        className="h-fit w-fit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Avatar className="w-[24px] h-[24px] cursor-pointer hover:opacity-80">
                            <AvatarImage src={avatar ?? defaultpfp} />
                        </Avatar>
                    </Link>

                    <Link
                        to={`/${username}`}
                        className="font-medium hover:underline cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {username}
                    </Link>
                    <span>•</span>
                    <span className="text-gray-500">{timeAgo}</span>
                </div>

                {/* Caption */}
                <p
                    className={`text-[14px] font-semibold leading-tight ${hasMedia ? "line-clamp-2" : "line-clamp-4"}`}
                >
                    {caption || "No caption"}
                </p>

                {/* Likes - only show if likes > 0 */}
                {likes > 0 && (
                    <p className="text-[12px] text-gray-500">
                        {likes.toLocaleString()} likes
                    </p>
                )}
            </div>

            {/* Post Image - only show if image exists */}
            {hasMedia && (
                <>
                    {postMedia.type === "image" ? (
                        <img
                            src={postMedia.url}
                            alt={caption || "Post image"}
                            className="w-[90px] h-[90px] rounded-md object-cover flex-shrink-0"
                            onError={(e) => {
                                // Hide image if it fails to load
                                (e.target as HTMLImageElement).style.display =
                                    "none";
                            }}
                        />
                    ) : (
                        <video
                            className="w-[90px] h-[90px] rounded-md object-cover flex-shrink-0"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <source src={postMedia.url} />
                        </video>
                    )}
                </>
            )}
        </div>
    );
}
