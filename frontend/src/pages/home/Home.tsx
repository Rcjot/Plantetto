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

                    <CreatePost>
                        <div className="self-center w-full flex justify-center ">
                            <div className="flex justify-center">diaries</div>
                        </div>
                    </CreatePost>

                    {/* diaries area */}

                    {/* feed area / posts */}
                    <FeedSection />
                    <Outlet />

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