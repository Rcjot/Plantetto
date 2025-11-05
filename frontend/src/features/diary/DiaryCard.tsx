import type { UserType } from "../auth/authTypes";
import type { DiaryMediaType } from "./diaryTypes";
import plantPlaceHolder from "@/assets/plant_placeholder.png";
import ProfilePicture from "@/components/ProfilePicture";
function DiaryCard({
    user,
    thumbnail,
}: {
    user: UserType;
    thumbnail: DiaryMediaType;
}) {
    return (
        <div className="card card-xl h-[200px] w-[130px] shadow-sm bg-200 flex flex-col">
            <div className="grid h-full w-full rounded-xl overflow-hidden shadow-md">
                {/* image or vid */}
                {thumbnail.media_url ? (
                    thumbnail.media_type === "image" ? (
                        <img
                            src={thumbnail.media_url}
                            className="w-full h-full max-h-[200px] object-cover col-span-full row-span-full"
                        />
                    ) : (
                        <video
                            className="w-full h-full object-cover col-span-full row-span-full"
                            controls
                        >
                            <source src={thumbnail.media_url} />
                        </video>
                    )
                ) : (
                    <img
                        src={plantPlaceHolder}
                        alt="plant"
                        className="w-full h-full object-cover col-span-full row-span-full"
                    />
                )}

                {/* pfp */}
                <div className="col-span-full row-span-full flex justify-start items-start p-2 pointer-events-none">
                    <ProfilePicture src={user.pfp_url} />
                </div>

                {/* name */}
                <div className="col-span-full row-span-full flex items-end justify-start p-1 pointer-events-none">
                    <div className="text-white text-start font-bold px-2 py-1 mb-2 text-sm rounded bg-neutral/75 w-fit">
                        {user.display_name ?? user.username}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiaryCard;