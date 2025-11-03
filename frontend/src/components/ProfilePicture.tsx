import defaultpfp from "@/assets/defaultpfp.png";

function ProfilePicture({
    src,
    size = "small",
}: {
    src: string | null;
    size?: string;
}) {
    if (size === "small") {
        return (
            <img
                src={src ?? defaultpfp}
                alt="profilepicture"
                className="rounded-full max-w-[45px] max-h-[45px]"
            />
        );
    }
    if (size === "normal") {
        return (
            <img
                src={src ?? defaultpfp}
                alt="profilepicture"
                className="rounded-full max-w-[150px] max-h-[150px]"
            />
        );
    }
}

export default ProfilePicture;
