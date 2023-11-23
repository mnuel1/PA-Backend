CREATE TABLE pa_admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contact VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  verify BOOLEAN NOT NULL DEFAULT FALSE,
  fullname VARCHAR(250) NOT NULL,
  employment_id VARCHAR(50) UNIQUE NOT NULL,
  office varchar(50) NOT NULL,
  image BYTEA DEFAULT NULL
);


CREATE TABLE pa_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  contact VARCHAR(100) UNIQUE NOT NULL,
  verify BOOLEAN NOT NULL DEFAULT FALSE,
  password VARCHAR(100) NOT NULL,
  fullname VARCHAR(250) NOT NULL,
  employment_id VARCHAR(50) UNIQUE NOT NULL,
  office varchar(50) NOT NULL,
  image BYTEA DEFAULT NULL
);


CREATE TABLE pa_users_notification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES pa_users(id) ON DELETE CASCADE
);

CREATE TABLE pa_events (
  id SERIAL PRIMARY KEY,
  event VARCHAR(100),
  description VARCHAR(500),
  dateTime TIMESTAMP NOT NULL,
  location VARCHAR(100),
  reminder TIMESTAMP NOT NULL
)

CREATE TABLE pa_users_events (
  id SERIAL PRIMARY KEY,  
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES pa_users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES pa_events(id) ON DELETE CASCADE
)