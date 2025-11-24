import type { UserType } from "../auth/authTypes";

export interface ConversationRoomType {
    uuid: string;
    recipient: UserType;
    recent_message: MessageType;
    last_read_message_id: number;
}

export interface MessageType {
    id: number;
    content: string;
    created_at: string;
    conversation_uuid: string;
    current_user_is_sender: boolean;
    sender: UserType;
}

export interface MessageSocketType extends MessageType {
    sender_username: string;
}

export interface ParticipantType extends UserType {
    last_read_message_id: number;
}
