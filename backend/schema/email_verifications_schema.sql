DROP TABLE IF EXISTS email_verifications CASCADE;
DROP TABLE IF EXISTS signup_email_verifications CASCADE;

CREATE TABLE email_verifications (
    PRIMARY KEY (user_id, verification_type),
    code VARCHAR(6),
    verification_type VARCHAR(20) DEFAULT 'verify',
    verification_data TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE signup_email_verifications (
    PRIMARY KEY (email),
    code VARCHAR(6),
    username VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE,
    user_password VARCHAR(50) NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);