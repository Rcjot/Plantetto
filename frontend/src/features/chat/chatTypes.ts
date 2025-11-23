import type { UserType } from "../auth/authTypes";

export interface ConversationRoomType {
    uuid: string;
    recipient: UserType;
}
