import { useState } from "react";
// 1. Import Outlet
import { Outlet } from "react-router-dom";
import BookmarkedPostsFeed from "@/features/bookmarks/BookmarkedPostsFeed";
import BookmarkedGuidesFeed from "@/features/bookmarks/BookmarkedGuidesFeed";

function Bookmarks() {
    const [activeTab, setActiveTab] = useState<"posts" | "guides">("posts");

    const containerClass = activeTab === "posts" ? "max-w-3xl" : "max-w-7xl";

    return (
        <div className="w-full h-full flex flex-col items-center bg-base-100 overflow-y-auto p-4">
            <div
                className={`w-full ${containerClass} flex flex-col gap-6 transition-all duration-300 px-4`}
            >
                {/* Header */}
                <div className="flex flex-col gap-4 mt-8">
                    <h1 className="text-3xl font-bold px-1">Bookmarks</h1>

                    {/* Tabs */}
                    <div className="w-full border-b border-base-200">
                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab("posts")}
                                className={`pb-3 text-lg font-medium transition-colors relative ${
                                    activeTab === "posts"
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-base-content"
                                }`}
                            >
                                Posts
                            </button>
                            <button
                                onClick={() => setActiveTab("guides")}
                                className={`pb-3 text-lg font-medium transition-colors relative ${
                                    activeTab === "guides"
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-gray-500 hover:text-base-content"
                                }`}
                            >
                                Guides
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="w-full min-h-[500px]">
                    {activeTab === "posts" ? (
                        <BookmarkedPostsFeed />
                    ) : (
                        <BookmarkedGuidesFeed />
                    )}
                </div>

                <Outlet />
            </div>
        </div>
    );
}

export default Bookmarks;