-- Run this in your Supabase SQL Editor

-- 1. Queries Cache (Global)
CREATE TABLE IF NOT EXISTS queries_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_text TEXT UNIQUE NOT NULL,
  json_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Media Metadata (Cloud Library)
CREATE TABLE IF NOT EXISTS media_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  channel TEXT,
  duration TEXT,
  thumbnail TEXT,
  download_count INTEGER DEFAULT 1,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. User History (Personal)
CREATE TABLE IF NOT EXISTS user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  query_text TEXT,
  type TEXT NOT NULL, -- 'roadmap' or 'media'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public read/insert for queries_cache and media_metadata (or configure RLS as needed)
ALTER TABLE queries_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read queries" ON queries_cache FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert queries" ON queries_cache FOR INSERT TO authenticated WITH CHECK (true);

ALTER TABLE media_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read media" ON media_metadata FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert media" ON media_metadata FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update media" ON media_metadata FOR UPDATE TO authenticated USING (true);

ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow users to read own history" ON user_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert own history" ON user_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_media_metadata_added_by ON media_metadata(added_by);
CREATE INDEX IF NOT EXISTS idx_user_history_user_id ON user_history(user_id);
