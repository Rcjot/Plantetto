DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE conversations (
    uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    conversation_id UUID NOT NULL REFERENCES conversations (uuid),
    user_id id NOT NULL REFERENCES users (id),
    last_read_message_id BIGINT DEFAULT 0,
    PRIMARY KEY (conversation_id, user_id)
)

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sender_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES conversations(uuid) ON DELETE CASCADE
)
