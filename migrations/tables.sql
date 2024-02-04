CREATE TABLE IF NOT EXISTS
  users (
    id SERIAL,
    username VARCHAR(20) UNIQUE,
    password_hash VARCHAR(64),
    PRIMARY KEY (id)
  );
CREATE TABLE IF NOT EXISTS
  sessions (
    id UUID UNIQUE,
    user_id INT,
    last_used TIMESTAMP,
    created_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
  )