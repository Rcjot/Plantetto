DROP TABLE IF EXISTS diaries CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE diaries (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    note TEXT,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video') OR media_type IS NULL),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    plant_id BIGSERIAL REFERENCES plants(id) ON DELETE CASCADE,
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE
);