export interface NotificationType {
    id: number;
    notification_type: string;
    is_read: boolean;
    payload: object;
    created_at: string;
}
