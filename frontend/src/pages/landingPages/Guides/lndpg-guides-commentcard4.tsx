import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import AVATAR_IMAGE from "@/assets/LandingPage/GuidesImages/Avatar4.png";

export function GuidesCommentCard4() {
    return (
        <Card className="flex flex-row items-center bg-[#F6C667] rounded-2xl shadow-lg px-4 py-3 gap-4 w-[380px] h-[60px] blur-[1px] drop-shadow-[2.86px_7.15px_20.46px_rgba(0,0,0,0.25)] border-none">
            <Avatar className="w-[30px] h-[30px]">
                <AvatarImage src={AVATAR_IMAGE} />
            </Avatar>
            <div className="flex flex-col justify-center flex-1 min-w-0">
                <div className="flex gap-2 items-center truncate">
                    <span className="text-[8px] font-bold truncate">
                        LOREM IPSUM
                    </span>
                    <span className="text-[8px] text-gray-700 truncate">
                        @lorem_ipsum &middot; Sept 1
                    </span>
                </div>
                <div className="text-[8px] text-left truncate mt-0.5">
                    Lorem ipsum mickeal dreaming genshin impact honkai star rail
                    warp
                </div>
            </div>
        </Card>
    );
}
export default GuidesCommentCard4;
