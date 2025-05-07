-- Create tables for RutinKata.id
-- Note: Run this in your Supabase SQL Editor

-- Create users table
-- For development, we'll drop the foreign key constraint to auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create threads table
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create replies table
CREATE TABLE IF NOT EXISTS public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(user_id, thread_id)
);

-- Create follows table
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES public.users(id) NOT NULL,
  following_id UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(follower_id, following_id)
);

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL, -- User receiving the activity
  actor_id UUID REFERENCES public.users(id) NOT NULL, -- User performing the action
  type VARCHAR(50) NOT NULL, -- e.g., 'like', 'reply', 'follow'
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.replies(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create thread_details view for easy fetching
CREATE OR REPLACE VIEW thread_details AS
SELECT 
  t.id,
  t.content,
  t.created_at,
  t.updated_at,
  t.user_id,
  u.username,
  u.display_name,
  u.avatar_url,
  COUNT(DISTINCT l.id) AS likes_count,
  COUNT(DISTINCT r.id) AS replies_count
FROM 
  threads t
  JOIN users u ON t.user_id = u.id
  LEFT JOIN likes l ON t.id = l.thread_id
  LEFT JOIN replies r ON t.id = r.thread_id
GROUP BY 
  t.id, u.id;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_thread_feed(UUID);

-- Create function to get thread feed
CREATE OR REPLACE FUNCTION get_thread_feed(
  current_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  username VARCHAR(50),
  display_name VARCHAR(100),
  avatar_url TEXT,
  likes_count BIGINT,
  replies_count BIGINT,
  has_liked BOOLEAN
)
LANGUAGE SQL
AS $$
  SELECT 
    td.id,
    td.content,
    td.created_at,
    td.updated_at,
    td.user_id,
    td.username,
    td.display_name,
    td.avatar_url,
    td.likes_count,
    td.replies_count,
    EXISTS (
      SELECT 1 FROM likes 
      WHERE thread_id = td.id AND user_id = current_user_id
    ) AS has_liked
  FROM 
    thread_details td
  ORDER BY 
    td.created_at DESC;
$$;

-- Sample data for testing - only for development
-- Note: In production, you should link to actual auth.users records
-- Create or replace sample users
-- Delete existing data first (in reverse order to avoid foreign key issues)
DELETE FROM public.activities WHERE actor_id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
) OR user_id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
);

DELETE FROM public.follows WHERE follower_id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
) OR following_id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
);

DELETE FROM public.likes WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
);

DELETE FROM public.replies WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
);

DELETE FROM public.media WHERE thread_id IN (
  SELECT id FROM public.threads WHERE user_id IN (
    '00000000-0000-0000-0000-000000000001', 
    '00000000-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000003'
  )
);

DELETE FROM public.threads WHERE user_id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
);

DELETE FROM public.users WHERE id IN (
  '00000000-0000-0000-0000-000000000001', 
  '00000000-0000-0000-0000-000000000002', 
  '00000000-0000-0000-0000-000000000003'
);

INSERT INTO public.users (id, username, display_name, avatar_url, bio)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'johndoe', 'John Doe', 'https://api.dicebear.com/6.x/avataaars/svg?seed=John', 'Just a regular guy'),
  ('00000000-0000-0000-0000-000000000002', 'janedoe', 'Jane Doe', 'https://api.dicebear.com/6.x/avataaars/svg?seed=Jane', 'Tech enthusiast'),
  ('00000000-0000-0000-0000-000000000003', 'mikesmith', 'Mike Smith', 'https://api.dicebear.com/6.x/avataaars/svg?seed=Mike', 'Coffee addict');

INSERT INTO public.threads (id, user_id, content)
VALUES 
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Hello, world! This is my first thread on RutinKata.'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'I just discovered RutinKata and I love it!'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000003', 'Any recommendations for good books to read?');

INSERT INTO public.likes (user_id, thread_id)
VALUES 
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102');

INSERT INTO public.replies (thread_id, user_id, content)
VALUES 
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000002', 'Welcome to RutinKata!'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'I recommend "Atomic Habits" by James Clear.');

INSERT INTO public.follows (follower_id, following_id)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001');

-- Triggers for activities
CREATE OR REPLACE FUNCTION create_like_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activities (user_id, actor_id, type, thread_id)
  SELECT 
    t.user_id, -- User who receives the activity notification
    NEW.user_id, -- User who liked
    'like',
    NEW.thread_id
  FROM threads t
  WHERE t.id = NEW.thread_id AND t.user_id != NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_added
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION create_like_activity();

CREATE OR REPLACE FUNCTION create_reply_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activities (user_id, actor_id, type, thread_id, reply_id)
  SELECT 
    t.user_id, -- User who receives the activity notification
    NEW.user_id, -- User who replied
    'reply',
    NEW.thread_id,
    NEW.id
  FROM threads t
  WHERE t.id = NEW.thread_id AND t.user_id != NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_added
AFTER INSERT ON replies
FOR EACH ROW
EXECUTE FUNCTION create_reply_activity();

CREATE OR REPLACE FUNCTION create_follow_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activities (user_id, actor_id, type)
  VALUES (NEW.following_id, NEW.follower_id, 'follow');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_follow_added
AFTER INSERT ON follows
FOR EACH ROW
EXECUTE FUNCTION create_follow_activity();
