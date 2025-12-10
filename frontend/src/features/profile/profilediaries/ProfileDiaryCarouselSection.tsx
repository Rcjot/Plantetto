import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import DiaryCircle from "./components/DiaryCircle";
import useDiaries from "./hooks/useDiaries";
import DiaryPopup2 from "./components/DiaryPopup2";
import { useState } from "react";
import DiaryAddPopupCircle from "./components/DiaryAddPopUp2";
import { useParams } from "react-router-dom";
import { useAuthContext } from "@/features/auth/AuthContext";

function ProfileDiaryCarouselSection() {
    const { username } = useParams();
    const { auth } = useAuthContext()!;

    const { diaryCircleList, fetchDiaries } = useDiaries();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentPlant, setCurrentPlant] = useState<{
        uuid: string;
        date: string;
    } | null>(null);

    const isOwnProfile = auth.user?.username === username;

    if (!diaryCircleList) return <div>Loading...</div>;

    if (diaryCircleList.length == 0) {
        if (isOwnProfile) {
            return (
                <div className="flex gap-3 w-full">
                    <DiaryAddPopupCircle fetchDiaries={fetchDiaries} />
                </div>
            );
        }
        return (
            <div className="text-gray-400 italic text-sm">No diaries yet.</div>
        );
    }

    const carouselItems = diaryCircleList.map((diaryCircle) => {
        if (!diaryCircle.user) return <div>no user? </div>;
        return (
            <CarouselItem key={`${diaryCircle.plant.plant_uuid}`}>
                <button
                    onClick={() => {
                        setCurrentPlant({
                            uuid: diaryCircle.plant.plant_uuid,
                            date: diaryCircle.diaries[0].created_at,
                        });
                        setDialogOpen(true);
                    }}
                >
                    <DiaryCircle
                        user={diaryCircle.user}
                        thumbnail={diaryCircle.thumbnail}
                        plant={diaryCircle.plant}
                        diaries={diaryCircle.diaries}
                    />
                </button>
            </CarouselItem>
        );
    });

    return (
        <div className="flex gap-3 w-full select-none ">
            <DiaryPopup2
                fetchDiaries={fetchDiaries}
                open={dialogOpen}
                setOpen={setDialogOpen}
                currentPlant={currentPlant}
                setCurrentPlant={setCurrentPlant}
                carouselItems={carouselItems}
            />

            <Carousel className="max-w-[95%] sm:w-6/6">
                <CarouselContent>
                    {/* If you ever uncomment this to add the button inside the carousel, 
                        wrap it in the same check: */}

                    {/* {isOwnProfile && (
                        <CarouselItem key={`add-diary-key`}>
                            <DiaryAddPopupCircle fetchDiaries={fetchDiaries} />
                        </CarouselItem> 
                    )} */}

                    {carouselItems}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

export default ProfileDiaryCarouselSection;
