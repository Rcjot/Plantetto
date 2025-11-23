import type { UserType } from "../auth/authTypes";

export interface ConversationRoomType {
    uuid: string;
    recipient: UserType;
}

export interface MessageType {
    content: string;
    created_at: string;
    current_user_is_sender: boolean;
    sender: UserType;
}

export interface MessageSocketType extends MessageType {
    sender_username: string;
}
