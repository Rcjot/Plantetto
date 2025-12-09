DROP TABLE IF EXISTS bookmarks_posts CASCADE;
DROP TABLE IF EXISTS bookmarks_guides CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE bookmarks_posts (
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, post_id)
);

CREATE TABLE bookmarks_guides (
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,   
    guide_id BIGINT REFERENCES guides(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(user_id, guide_id)
  );