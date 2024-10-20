CREATE TABLE users ( -- User auth table, only holds stuff related to auth, project related data must go in a seperate table (user_profiles) that references the user id
    id UUID PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    email_verified_at TIMESTAMP,
    number_of_email_changes INTEGER DEFAULT 0 NOT NULL,
    last_email_change TIMESTAMP,
    has_password_enabled BOOLEAN DEFAULT true NOT NULL,
    password TEXT,
    number_of_password_changes INTEGER DEFAULT 0 NOT NULL,
    last_password_change TIMESTAMP,
    has_avatar BOOLEAN DEFAULT false NOT NULL,
    avatar_url TEXT,
    is_totp_enabled BOOLEAN DEFAULT false NOT NULL,
    totp_secret TEXT,
    passkey_enabled BOOLEAN DEFAULT false NOT NULL,
    user_type TEXT DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_sign_in_at TIMESTAMP
);

CREATE TABLE user_profiles (
    id UUID REFERENCES users(id) NOT NULL,
    country_of_origin VARCHAR(255),
    languages_spoken TEXT[],
    tags TEXT[],
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_passkeys ( -- Store user id
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    credential_id TEXT NOT NULL,
    public_key TEXT NOT NULL,
    counter BIGINT NOT NULL,
    note TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_used TIMESTAMP
);

CREATE TABLE user_sessions ( -- user session tracking
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    last_rotation TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_agent VARCHAR(255),
    user_location TEXT,
    ip_address VARCHAR(45),
    revoked BOOLEAN DEFAULT FALSE NOT NULL, -- as long as revoked is false, the session is valid
    revoked_reason TEXT,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '90 days'
);
