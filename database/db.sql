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
INSERT INTO pa_admin (
  username, 
  email, 
  contact, 
  password, 
  verify, 
  fullname, 
  employment_id, 
  office, 
  image
) VALUES (
  'admin_123',
  'admin@example.com',
  '091234567',
  '12345678',
  true, 
  'Admin',
  'admin-123',
  'Main Office',
  NULL 
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

INSERT INTO pa_users (
  username, 
  email, 
  contact, 
  verify, 
  password, 
  fullname, 
  employment_id, 
  office, 
  image
) VALUES (
  'user_123',
  'user@example.com',
  '091234567',
  false, 
  '12345678',
  'User',
  'user-123',
  'Main Office',
  NULL 
);



CREATE TABLE pa_users_notification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  event_id INTEGER,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  invitation BOOLEAN DEFAULT FALSE,
  comment VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES pa_users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES pa_events(id) ON DELETE CASCADE
);

CREATE TABLE pa_admin_notification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  invitation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES pa_users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES pa_events(id) ON DELETE CASCADE
);

CREATE TABLE pa_events (
  id SERIAL PRIMARY KEY,
  event VARCHAR(100),
  description VARCHAR(500),
  dateTime TIMESTAMP NOT NULL,
  location VARCHAR(100),
  reminder TIMESTAMP NOT NULL
);

CREATE TABLE pa_users_events (
  id SERIAL PRIMARY KEY,  
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  starred BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES pa_users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES pa_events(id) ON DELETE CASCADE
);

CREATE TABLE pa_users_attendance (
  id SERIAL PRIMARY KEY,  
  user_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  comments VARCHAR(200),
  attend BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES pa_users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES pa_events(id) ON DELETE CASCADE
);


CREATE TABLE pa_reports (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  endTime TIMESTAMP NOT NULL,
  narrative VARCHAR(200),
  FOREIGN KEY (event_id) REFERENCES pa_events(id) ON DELETE CASCADE
);
