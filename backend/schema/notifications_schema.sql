DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    notification_type VARCHAR(10) 
        CHECK (notification_type IN ('post', 'message', 'follow', 'guide', 'comment_post', 'comment_guide', 'like_post')),
    is_read BOOLEAN DEFAULT FALSE,
    payload JSONB NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- post redirect link : post link
-- message redirect link : open messages and set conversation room to room
-- follow redirect link : profile page
-- guide redirect link : guide link


-- payload : {}


-- post payload : {caption: string; author: UserType; post_uuid: string}
-- message payload : {message : string;  sender: UserType; room_uuid: string}
-- follow payload : {follower: UserType; }
-- guide payload : {title: string; author: UserType; guide_uuid: string}
-- comment_post payload : {content: string; author: UserType; post_uuid: string}
-- comment_guide payload : {content: string; author: UserType; guide_uuid: string}
-- like_post payload : {post_uuid: string; liker: UserType}



-- allow users to turn on/off notifications for each type