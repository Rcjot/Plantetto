import type { UserType } from "../auth/authTypes";

export interface PlantType {
    plant_uuid: string;
    nickname: string;
    description: string;
    owner: UserType;
    picture_url: string;
    plant_type: string;
    for_sale: boolean;
    market_item_uuid: string;
}

export interface PlanttypeType {
    id: number | undefined;
    plant_name: string;
}

export interface PlantOptionType {
    id: string;
    uuid: string;
    nickname: string;
    plant_type: string;
}
