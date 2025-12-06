DROP TABLE IF EXISTS market_items CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE market_items (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    description VARCHAR(255),
    price NUMERIC(10,2) NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'sold')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sold_at TIMESTAMPTZ NULL,
    plant_id BIGINT REFERENCES plants(id) UNIQUE,
    user_id BIGINT REFERENCES users(id)
)