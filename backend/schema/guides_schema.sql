DROP TABLE IF EXISTS guides CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE guides (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL DEFAULT 'Untitled',
    content JSONB NULL,
    guide_status VARCHAR(10) CHECK (guide_status IN ('draft', 'published')) DEFAULT 'draft',
    last_edit_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    published_date TIMESTAMPTZ NULL,
    plant_type_id BIGINT NULL REFERENCES plant_types(id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE guides_images (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    image_url TEXT,
    is_used BOOLEAN DEFAULT FALSE,
    guide_id BIGINT REFERENCES guides(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)