DROP TABLE IF EXISTS email_verifications CASCADE;

CREATE TABLE email_verifications (
    PRIMARY KEY (user_id, verification_type),
    code VARCHAR(6),
    verification_type VARCHAR(20) DEFAULT 'verify',
    verification_data TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
)