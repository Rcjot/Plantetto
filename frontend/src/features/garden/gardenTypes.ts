import type { UserType } from "../auth/authTypes";

export interface PlantType {
    plant_uuid: string;
    nickname: string;
    plant_description: string;
    owner: UserType;
    picture_url: string;
    plant_type: string;
}

export interface PlanttypeType {
    id: number;
    name: string;
}
