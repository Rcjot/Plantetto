import type { UserType } from "../auth/authTypes";
import type { PlantType } from "../garden/gardenTypes";

export interface MarketItemType {
    uuid: string;
    description: string;
    plant: PlantType;
    price: string;
    status: "active" | "sold";
    bookmarked: boolean;
    owner: UserType;
}
