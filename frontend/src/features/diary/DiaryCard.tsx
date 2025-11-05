import type { UserType } from "../auth/authTypes";
import type { DiaryMediaType } from "./diaryTypes";

function DiaryCard({
    user,
    thumbnail,
}: {
    user: UserType;
    thumbnail: DiaryMediaType;
}) {
    return (
        <div className="card card-xl h-[12rem] w-[138px] shadow-sm bg-200 m-4 flex flex-col p-2 items-center">
            <div>{user.username}</div>
            {thumbnail.media_url && (
                <>
                    {thumbnail.media_type === "image" ? (
                        <img
                            src={thumbnail.media_url}
                            className="w-full h-full md:h-[65vh] object-cover rounded-xl shadow-md"
                        />
                    ) : (
                        <video>
                            <source src={thumbnail.media_url} />
                        </video>
                    )}
                </>
            )}
        </div>
    );
}

export default DiaryCard;