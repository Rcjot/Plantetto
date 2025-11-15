
DROP TABLE IF EXISTS posts CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    caption TEXT,
    visibility VARCHAR(10) CHECK (visibility IN ('everyone', 'private', 'for_me')) DEFAULT 'everyone',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id BIGSERIAL REFERENCES users(id)
);


DROP TABLE IF EXISTS media CASCADE;


CREATE TABLE media (
    id BIGSERIAL PRIMARY KEY,
    media_url TEXT NOT NULL,
    media_order SMALLINT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    post_id BIGSERIAL REFERENCES posts(id) ON DELETE CASCADE,
    width INT NOT NULL,
    height INT NOT NULL
);

