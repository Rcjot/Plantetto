import { Bookmark, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import bookmarksApi from "@/api/bookmarksApi";
import type { UserType } from "../auth/authTypes";
import { useAuthContext } from "../auth/AuthContext";

interface MarketCardProps {
    owner: UserType;
    uuid?: string;
    image: string;
    title: string;
    price: string;
    onClick?: () => void;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onMarkAsSold?: () => void;
    onMarkAsActive?: () => void;
    status?: "active" | "sold";
    bookmarked?: boolean;
}

export default function MarketCard({
    owner,
    uuid,
    image,
    title,
    price,
    onClick,
    showActions = false,
    onEdit,
    onDelete,
    onMarkAsSold,
    onMarkAsActive,
    status = "active",
    bookmarked,
}: MarketCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(bookmarked);
    const { auth } = useAuthContext()!;

    async function toggleBookmarkMarketItem() {
        const { ok, action } =
            await bookmarksApi.toggleBookmarkMarketItem(uuid);
        if (ok) {
            setIsBookmarked(action === "bookmark");
        }
    }

    const isOwner = owner.id === auth.user?.id;

    return (
        <div className="max-w-xs w-full cursor-pointer group relative">
            {showActions && (
                <div
                    className="absolute top-2 right-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="btn btn-sm btn-circle bg-white/90 hover:bg-white border-none shadow-md">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-base-100">
                            <DropdownMenuItem
                                className="hover:!bg-success hover:!text-white transition-colors duration-200 cursor-pointer"
                                onClick={onEdit}
                            >
                                Edit
                            </DropdownMenuItem>
                            {status === "active" ? (
                                <DropdownMenuItem
                                    className="hover:!bg-success hover:!text-white transition-colors duration-200 cursor-pointer"
                                    onClick={onMarkAsSold}
                                >
                                    Mark as Sold
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="hover:!bg-success hover:!text-white transition-colors duration-200 cursor-pointer"
                                    onClick={onMarkAsActive}
                                >
                                    Mark as Active
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                className="hover:!bg-red-500 hover:!text-white transition-colors duration-200 cursor-pointer"
                                onClick={onDelete}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <div onClick={onClick}>
                <div className="relative w-[300px] h-[300px] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                    {/* image */}
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* status badge */}
                    {status === "sold" && (
                        <div className="absolute top-3 left-3">
                            <span className="badge badge-warning">Sold</span>
                        </div>
                    )}

                    {/* bottom overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-gray-300/70 backdrop-blur-sm px-3 py-3">
                        <div className="text-sm font-medium text-gray-800 truncate">
                            {title}
                        </div>
                        <div className="text-lg font-bold text-green-700 mt-1">
                            ₱{price}
                        </div>
                    </div>
                    {!isOwner && (
                        <button
                            className="absolute bottom-5 right-5 cursor-pointer hover:bg-transparent hover:shadow-none"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmarkMarketItem();
                            }}
                        >
                            <Bookmark
                                className={`hover:scale-115  hover:text-neutral transition-colors ${isBookmarked && "fill-success"} `}
                            />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
