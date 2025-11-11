DROP TABLE IF EXISTS guides CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE guides (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL DEFAULT 'Untitled',
    content JSONB NULL,
    guide_status VARCHAR(10) CHECK (guide_status IN ('draft', 'published')) DEFAULT 'draft',
    last_edit TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    plant_type_id BIGSERIAL REFERENCES plant_types(id) ON DELETE CASCADE,
    user_id BIGSERIAL REFERENCES users(id) ON DELETE CASCADE
);