DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE conversations (
    uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    conversation_uuid UUID NOT NULL REFERENCES conversations (uuid) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users (id),
    last_read_message_id BIGINT DEFAULT 0,
    PRIMARY KEY (conversation_uuid, user_id)
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sender_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    conversation_uuid UUID REFERENCES conversations(uuid) ON DELETE CASCADE
);
