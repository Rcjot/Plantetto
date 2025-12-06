export interface CommentAuthor {
    id: string;
    username: string;
    display_name: string | null;
    pfp_url: string | null;
}

export interface CommentType {
    uuid: string;
    content: string;
    created_at: string;
    last_edit_date: string | null;
    author: CommentAuthor;
    parent_uuid?: string | null;
}

export interface ApiCommentType {
    uuid: string;
    content: string;
    created_at: string;
    last_edit_date: string | null;
    author: {
        id: string;
        username: string;
        display_name: string | null;
        pfp_url: string | null;
    };
    parent_uuid?: string | null;
    children?: ApiCommentType[];
    has_more_replies?: boolean;
}
