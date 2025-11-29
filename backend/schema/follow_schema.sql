DROP TABLE IF EXISTS follows CASCADE;

CREATE TABLE follows (
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    notify_post BOOLEAN DEFAULT TRUE,
    notify_guide BOOLEAN DEFAULT TRUE,
    PRIMARY KEY(follower_id, following_id)
);