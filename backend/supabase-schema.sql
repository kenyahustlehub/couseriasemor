-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  first_name text,
  last_name text,
  total_points integer DEFAULT 0,
  profile_picture_url text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  category text,
  price numeric,
  is_free boolean DEFAULT true,
  total_lessons integer DEFAULT 0
);

-- Course progress table
CREATE TABLE IF NOT EXISTS course_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  course_id uuid REFERENCES courses(id),
  lessons_completed integer DEFAULT 0,
  progress_percentage integer DEFAULT 0,
  is_completed boolean DEFAULT false
);

-- Points table
CREATE TABLE IF NOT EXISTS points (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  points_earned integer NOT NULL,
  points_type text,
  course_id uuid REFERENCES courses(id),
  description text,
  created_at timestamptz DEFAULT now()
);
