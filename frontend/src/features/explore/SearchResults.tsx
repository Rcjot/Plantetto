import { useState } from "react";
import SearchResultsPosts from "@/features/explore/SearchResultPosts";
import SearchResultsUsers from "@/features/explore/SearchResultUsers";

interface Props {
    search: string;
}

export default function SearchResults({ search }: Props) {
    const [activeTab, setActiveTab] = useState<"sprouts" | "users">("sprouts");

    return (
        <div className="flex flex-col gap-6">
            {/* tabs */}
            <div className="flex gap-4 border-b border-base-300">
                <button
                    onClick={() => setActiveTab("sprouts")}
                    className={`pb-3 px-4 font-semibold transition-colors ${
                        activeTab === "sprouts"
                            ? "text-primary border-b-2 border-primary"
                            : "text-neutral-500 hover:text-neutral-700"
                    }`}
                >
                    Sprouts
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`pb-3 px-4 font-semibold transition-colors ${
                        activeTab === "users"
                            ? "text-primary border-b-2 border-primary"
                            : "text-neutral-500 hover:text-neutral-700"
                    }`}
                >
                    Users
                </button>
            </div>

            {/* content */}
            <div>
                {activeTab === "sprouts" ? (
                    <SearchResultsPosts search={search} />
                ) : (
                    <SearchResultsUsers search={search} />
                )}
            </div>
        </div>
    );
}
