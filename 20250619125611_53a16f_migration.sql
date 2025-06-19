-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('entrepreneur', 'investor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  entrepreneur_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  minimum_investment DECIMAL(15, 2) NOT NULL,
  reward_type TEXT NOT NULL,
  reward_description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project media table
CREATE TABLE IF NOT EXISTS project_media (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id SERIAL PRIMARY KEY,
  investor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL,
  platform_fee DECIMAL(15, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  reporter_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (email, password, name, user_type)
VALUES ('admin@launchtribe.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample entrepreneurs
INSERT INTO users (email, password, name, user_type)
VALUES 
  ('entrepreneur1@example.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm', 'John Entrepreneur', 'entrepreneur'),
  ('entrepreneur2@example.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm', 'Sarah Creator', 'entrepreneur')
ON CONFLICT (email) DO NOTHING;

-- Insert some sample investors
INSERT INTO users (email, password, name, user_type)
VALUES 
  ('investor1@example.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm', 'Mark Investor', 'investor'),
  ('investor2@example.com', '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm', 'Lisa Capital', 'investor')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (entrepreneur_id, title, description, minimum_investment, reward_type, reward_description, category, status, is_featured)
VALUES
  ((SELECT id FROM users WHERE email = 'entrepreneur1@example.com'), 
   'EcoFriendly Water Bottle', 
   'A revolutionary water bottle that filters water and is made from biodegradable materials. Our mission is to reduce plastic waste while providing clean drinking water to consumers.', 
   1000, 
   'Equity', 
   '2% equity stake in the company', 
   'Environment', 
   'approved', 
   TRUE),
   
  ((SELECT id FROM users WHERE email = 'entrepreneur1@example.com'), 
   'Smart Home Energy Monitor', 
   'A device that tracks and optimizes your home energy usage, helping you save money and reduce your carbon footprint.', 
   2500, 
   'Revenue Sharing', 
   '3% of revenue for 5 years', 
   'Technology', 
   'approved', 
   FALSE),
   
  ((SELECT id FROM users WHERE email = 'entrepreneur2@example.com'), 
   'Organic Farm Subscription Box', 
   'Weekly delivery of fresh, organic produce directly from our farm to your doorstep. Supporting local agriculture and promoting healthy eating habits.', 
   1500, 
   'Product', 
   'Lifetime membership with 15% discount on all purchases', 
   'Food & Beverage', 
   'approved', 
   TRUE),
   
  ((SELECT id FROM users WHERE email = 'entrepreneur2@example.com'), 
   'Virtual Reality Fitness Platform', 
   'An immersive VR fitness experience that makes working out fun and engaging. Includes personalized training programs and multiplayer competitions.', 
   3000, 
   'Early Access', 
   'Lifetime premium subscription and beta access to all new features', 
   'Sports & Fitness', 
   'pending', 
   FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample project media
INSERT INTO project_media (project_id, media_type, media_url)
VALUES
  ((SELECT id FROM projects WHERE title = 'EcoFriendly Water Bottle'), 'image', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
  ((SELECT id FROM projects WHERE title = 'EcoFriendly Water Bottle'), 'image', 'https://images.unsplash.com/photo-1523362289600-a70b4a0e09e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
  ((SELECT id FROM projects WHERE title = 'EcoFriendly Water Bottle'), 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  
  ((SELECT id FROM projects WHERE title = 'Smart Home Energy Monitor'), 'image', 'https://images.unsplash.com/photo-1558002038-1055e2dae1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
  ((SELECT id FROM projects WHERE title = 'Smart Home Energy Monitor'), 'image', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
  
  ((SELECT id FROM projects WHERE title = 'Organic Farm Subscription Box'), 'image', 'https://images.unsplash.com/photo-1627661146131-c2527a1007b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
  ((SELECT id FROM projects WHERE title = 'Organic Farm Subscription Box'), 'image', 'https://images.unsplash.com/photo-1530364914203-d6c1f3f8d550?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
  
  ((SELECT id FROM projects WHERE title = 'Virtual Reality Fitness Platform'), 'image', 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'),
  ((SELECT id FROM projects WHERE title = 'Virtual Reality Fitness Platform'), 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ')
ON CONFLICT DO NOTHING;

-- Insert sample investments
INSERT INTO investments (investor_id, project_id, amount, platform_fee, status)
VALUES
  ((SELECT id FROM users WHERE email = 'investor1@example.com'),
   (SELECT id FROM projects WHERE title = 'EcoFriendly Water Bottle'),
   2000, 100, 'completed'),
   
  ((SELECT id FROM users WHERE email = 'investor2@example.com'),
   (SELECT id FROM projects WHERE title = 'EcoFriendly Water Bottle'),
   1500, 75, 'completed'),
   
  ((SELECT id FROM users WHERE email = 'investor1@example.com'),
   (SELECT id FROM projects WHERE title = 'Organic Farm Subscription Box'),
   3000, 150, 'completed'),
   
  ((SELECT id FROM users WHERE email = 'investor2@example.com'),
   (SELECT id FROM projects WHERE title = 'Smart Home Energy Monitor'),
   5000, 250, 'completed')
ON CONFLICT DO NOTHING;