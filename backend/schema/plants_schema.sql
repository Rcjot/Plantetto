DROP TABLE IF EXISTS plant_types CASCADE;
DROP TABLE IF EXISTS plants CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE plant_types(
    id BIGSERIAL PRIMARY KEY,
    plant_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE plants (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    plant_description VARCHAR(255),
    picture_url TEXT DEFAULT NULL,
    plant_type_id BIGSERIAL REFERENCES plant_types(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);