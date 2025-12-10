import type { UserType } from "../auth/authTypes";

export interface NotificationType {
    id: number;
    notification_type: string;
    is_read: boolean;
    payload: PayloadType | EntityPayloadType | LikePayloadType;
    created_at: string;
}

export interface PayloadType {
    actor: UserType;
}
// follow payload

export interface EntityPayloadType extends PayloadType {
    content: string;
    entity_uuid: string;
}
// posts, guides, comments

export interface LikePayloadType extends PayloadType {
    entity_uuid: string;
}
//likes
