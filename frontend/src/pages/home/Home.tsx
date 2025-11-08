import CreatePost from "@/features/posts/CreatePost";
import FeedSection from "@/features/posts/FeedSection";
import { Outlet } from "react-router-dom";
import DiaryCarouselSection from "@/features/diary/DiaryCarouselSection";
import { RecentBlock } from "@/features/recent/RecentBlock";

function Home() {
    return (
        <div className="w-full h-full flex bg-base-100 relative">
            {/* homepage */}
            <div className="flex-1 flex flex-col items-center p-4 gap-4 overflow-y-auto lg:pr-[calc(20rem+1rem)]">
                <div className="w-full max-w-3xl space-y-4">
                    {/* create post */}

                    <CreatePost>
                        <div className="self-center w-full flex justify-center ">
                            <DiaryCarouselSection />
                        </div>
                    </CreatePost>

                    {/* diaries area */}

                    {/* feed area / posts */}
                    <FeedSection />
                    <Outlet />

                    {/* feed area can be empty for the ticket, homepage:feed should handle this */}
                </div>
            </div>

            <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-84 p-4 bg-base-100 border-base-300 border-l overflow-y-auto z-10">
                <RecentBlock />
            </div>
        </div>
    );
}

export default Home;
