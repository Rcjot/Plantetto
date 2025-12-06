DROP TABLE IF EXISTS likes_posts CASCADE;
DROP TABLE IF EXISTS likes_comments_posts CASCADE;
DROP TABLE IF EXISTS likes_comments_guides CASCADE;
DROP TABLE IF EXISTS likes_guides CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE likes_posts (
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, post_id)
);

CREATE TABLE likes_comments_posts (
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,   
    comment_post_id BIGINT REFERENCES comments_posts(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, comment_post_id)
  );

CREATE TABLE likes_comments_guides (
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,   
    comment_guide_id BIGINT REFERENCES comments_guides(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, comment_guide_id)
  );

CREATE TABLE likes_guides (
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,   
    guide_id BIGINT REFERENCES guides(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, guide_id)
  );