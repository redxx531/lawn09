-- Insert the specified admin user
INSERT INTO users (email, password, name, user_type)
VALUES ('redxxx531@gmail.com', '$2a$10$8dVD15oRfGCWnGm/PYiRHupPRmKdNNHC1eC51YS75JedoGZX/ZSKO', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;