import type { UserType } from "../auth/authTypes";
import type { PlanttypeType } from "../garden/gardenTypes";

export interface GuideType {
    uuid: string;
    title: string;
    content: object | null;
    created_at: string;
    plant_type: PlanttypeType;
    author: UserType;
}
