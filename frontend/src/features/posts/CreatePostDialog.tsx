import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ProfilePicture from "@/components/ProfilePicture";
import { useAuthContext } from "../auth/AuthContext";
import globeIcon from "@/assets/icons/globe.svg";
import lockIcon from "@/assets/icons/lock.svg";
import CreatePostForm from "./CreatePostForm";
import { useCreatePostContext } from "./context/PostContext";
import { User } from "lucide-react";
import { XCircle } from "lucide-react";
import PlantTaggingSection from "./PlantTaggingSection";
import type { PlantOptionType } from "../garden/gardenTypes";

function CreatePostDialog({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { auth } = useAuthContext()!;
    const { visibility, setVisibility, plantTags, setPlantTags } =
        useCreatePostContext()!;

    function removePlant(plant: PlantOptionType) {
        setPlantTags((prev) => prev.filter((p) => p.id != plant.id));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[550px] max-h-[95vh] overflow-y-auto bg-base-100">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Create new sprout
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Sprout a new post, greenify the feed!
                    </DialogDescription>
                    <div className="flex gap-3">
                        <ProfilePicture />
                        <div className="flex flex-col">
                            <h1 className="font-bold text-start">
                                {auth.user?.display_name ?? auth.user?.username}
                            </h1>
                            <div className="flex items-center gap-1">
                                {visibility === "everyone" ? (
                                    <img
                                        src={globeIcon}
                                        className="w-4 h-4 left-20 absolute z-20"
                                        alt="globe"
                                    />
                                ) : visibility === "private" ? (
                                    <img
                                        src={lockIcon}
                                        className="w-4 h-4 left-20 absolute z-20"
                                        alt="lock"
                                    />
                                ) : (
                                    <User className="w-4 h-4 left-20 absolute z-20" />
                                )}
                                <select
                                    className="select appearance-none select-ghost w-fit h-fit pl-5 focus:outline-none focus:ring-1"
                                    value={visibility}
                                    onChange={(e) => {
                                        setVisibility(
                                            e.target.value as
                                                | "everyone"
                                                | "private"
                                                | "for_me"
                                        );
                                    }}
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="private">Private</option>
                                    <option value="for_me">For me</option>
                                </select>
                            </div>
                        </div>

                        <PlantTaggingSection
                            plantTags={plantTags}
                            setPlantTags={setPlantTags}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {plantTags.map((p) => {
                            return (
                                <div
                                    key={p.id}
                                    className="badge badge-soft badge-primary"
                                >
                                    <p>{p.nickname}</p>
                                    <button onClick={() => removePlant(p)}>
                                        <XCircle className="h-4 w-4 text-warning cursor-pointer" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <CreatePostForm setOpen={setOpen} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default CreatePostDialog;
