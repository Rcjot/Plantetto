DROP TABLE IF EXISTS notifications CASCADE;

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    notification_type VARCHAR(10) 
        CHECK (notification_type IN ('post', 'message', 'follow', 'guide', 'diary', 'comment_post', 'comment_guide', 'like_post', 'like_guide')),
    is_read BOOLEAN DEFAULT FALSE,
    payload JSONB NULL,
    entity_id BIGINT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    actor_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX uniq_follow
ON notifications (user_id, actor_id, notification_type)
WHERE notification_type = 'follow';

CREATE UNIQUE INDEX uniq_like
ON notifications (user_id, actor_id, entity_id, notification_type)
WHERE notification_type = 'like';


-- post redirect link : post link
-- message redirect link : open messages and set conversation room to room
-- follow redirect link : profile page
-- guide redirect link : guide link


-- payload : {}


-- follow payload : {actor: UserType; }
-- like_post payload : {entity_uuid: string; actor: UserType}

-- post payload : {content: string; actor: UserType; entity_uuid: string}
-- guide payload : {content: string; actor: UserType; entity_uuid: string}
-- comment_post payload : {content: string; actor: UserType; entity_uuid: string}
-- comment_guide payload : {content: string; actor: UserType; entity_uuid: string}
-- message payload : {content: string;  actor: UserType; entity_uuid: string}



-- allow users to turn on/off notifications for each type