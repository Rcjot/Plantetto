import defaultpfp from "@/assets/defaultpfp.png";
import { useAuthContext } from "@/features/auth/AuthContext";

function ProfilePicture({
    src = "defaultuserpfp",
    size = "small",
}: {
    src?: string | null;
    size?: string;
}) {
    const { auth } = useAuthContext()!;
    if (src === "defaultuserpfp" && auth.user) {
        src = auth.user.pfp_url;
    }

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
