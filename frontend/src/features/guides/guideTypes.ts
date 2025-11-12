import type { UserType } from "../auth/authTypes";
import type { PlanttypeType } from "../garden/gardenTypes";

export interface GuideType {
    uuid: string;
    title: string;
    content: object | null;
    guide_status: "draft" | "published";
    created_at: string;
    plant_type: PlanttypeType | null;
    author: UserType;
}
