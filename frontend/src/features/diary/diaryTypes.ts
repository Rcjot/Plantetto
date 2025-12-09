import type { UserType } from "../auth/authTypes";
import type { PlantType } from "../garden/gardenTypes";

export interface PlantDiaryType {
    uuid: string;
    note: string;
    plant: string;
    plant_id: number;
    media_url: string | null;
    media_type: "image" | "video" | null;
    created_at: string;
}

export interface DiaryMediaType {
    media_url: string | null;
    media_type: "image" | "video" | null;
}

export interface DiaryCardType {
    diaries: PlantDiaryType[];
    user: UserType;
    thumbnail: DiaryMediaType;
}

export interface DiaryCircleType extends DiaryCardType {
    plant: PlantType;
}
