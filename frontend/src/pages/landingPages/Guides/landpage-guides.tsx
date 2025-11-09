import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GuidesCommentCard1 } from "./lndpg-guides-commentcard1.tsx";
import { GuidesCommentCard2 } from "./lndpg-guides-commentcard2.tsx";
import { GuidesCommentCard3 } from "./lndpg-guides-commentcard3.tsx";
import { GuidesCommentCard4 } from "./lndpg-guides-commentcard4.tsx";
import { GuideMainCard } from "./lndpg-guides-maincard.tsx";
import { TextPart } from "./lndpg-guides-text.tsx";

import PLANT_IMAGE from "@/assets/LandingPage/GuidesImages/clivia.png";

export function LPGuides() {
    return (
        <div className="bg-[#9FB892]">
            <div className="flex flex-row w-full min-h-screen">
                {/* Left Container */}
                <div
                    id="left-container"
                    className="relative w-1/2 min-w-[400px]"
                >
                    <div className="absolute top-[300px] left-[100px] z-10">
                        <Avatar className="w-[200px] h-[200px]">
                            <AvatarImage src={PLANT_IMAGE} />
                        </Avatar>
                    </div>
                    <div className="absolute top-[300px] left-[60px] z-0">
                        <GuideMainCard />
                    </div>
                    <div className="absolute top-[150px] left-[100px] z-10">
                        {" "}
                        <GuidesCommentCard1 />{" "}
                    </div>
                    <div className="absolute top-[230px] left-[300px] z-10">
                        {" "}
                        <GuidesCommentCard2 />{" "}
                    </div>
                    <div className="absolute bottom-[220px] left-[145px] z-10">
                        {" "}
                        <GuidesCommentCard3 />{" "}
                    </div>
                    <div className="absolute bottom-[140px] left-[270px] z-10">
                        {" "}
                        <GuidesCommentCard4 />{" "}
                    </div>
                </div>

                {/* Right Container */}
                <div
                    id="right-container"
                    className="flex flex-col justify-center w-1/2 px-12 border-0"
                >
                    <TextPart />
                </div>
            </div>
        </div>
    );
}
export default LPGuides;
