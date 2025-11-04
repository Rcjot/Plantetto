import CreatePost from "@/features/posts/CreatePost";
import FeedSection from "@/features/posts/FeedSection";
import { Outlet } from "react-router-dom";

function Home() {
    return (
        <div className="w-full h-full flex bg-base-100">
            {/* homepage */}
            <div className="flex-1 flex flex-col items-center p-4 gap-4 overflow-y-auto">
                <div className="w-full max-w-2xl space-y-4">
                    {/* create post */}
                    <div className="bg-base-100 rounded-lg shadow border border-base-300 p-4">
                        <p className="text-base-content">
                            <CreatePost />
                        </p>
                    </div>
                    {/* diaries area */}
                    <div className="mb-4">
                        <div className="flex justify-center">diaries</div>
                    </div>
                    {/* feed area / posts */}
                    <FeedSection />
                    <Outlet />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className="bg-base-400 rounded-lg shadow-sm border border-base-300 p-4"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="avatar placeholder">
                                        <div className="bg-base-300 text-neutral-content rounded-full w-10"></div>
                                    </div>
                                    <div>
                                        <p>user{i}</p>
                                        <p className="text-xs text-base-content">
                                            3 billion years ago
                                        </p>
                                    </div>
                                </div>
                                {/*style for this shouldnt matter for now cuz placeholder*/}
                                <div className="bg-white h-32 rounded-lg border border-base-300 flex items-center justify-center mb-3">
                                    <span className="text-base-content">
                                        placeholder content
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* feed area can be empty for the ticket, homepage:feed should handle this */}
                </div>
            </div>

            {/* recent feed*/}
            <div className="hidden lg:flex w-80 p-4 bg-base-100 border-l border-base-300 overflow-y-auto">
                <div className="w-full">
                    {/* call the class here or something idk, homepage:recent handles this*/}
                </div>
            </div>
        </div>
    );
}

export default Home;
