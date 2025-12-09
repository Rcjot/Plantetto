DROP TABLE IF EXISTS email_verifications CASCADE;

CREATE TABLE email_verifications (
    PRIMARY KEY (user_id),
    code VARCHAR(6),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
)