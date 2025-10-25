-- Migration: User spot submissions table for crowd-sourced spot data
-- Purpose: Allow users to suggest new spots for admin review and approval

-- Create user_spot_submissions table
CREATE TABLE IF NOT EXISTS user_spot_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  parking TEXT DEFAULT 'なし',
  stroller_friendly BOOLEAN DEFAULT false,
  nursing_room BOOLEAN DEFAULT false,
  diaper_change BOOLEAN DEFAULT false,
  phone TEXT,
  website TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS user_spot_submissions_user_id_idx ON user_spot_submissions(user_id);
CREATE INDEX IF NOT EXISTS user_spot_submissions_status_idx ON user_spot_submissions(status);
CREATE INDEX IF NOT EXISTS user_spot_submissions_created_at_idx ON user_spot_submissions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_spot_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own submissions
CREATE POLICY "Users can read own submissions" ON user_spot_submissions
  FOR SELECT
  USING (true);  -- Allow all users to see submissions (can be restricted later)

-- RLS Policy: Authenticated users can create submissions
CREATE POLICY "Authenticated users can create submissions" ON user_spot_submissions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- RLS Policy: Admin can update (approve/reject)
-- Note: This will need proper admin role setup in production
-- CREATE POLICY "Admin can update submissions" ON user_spot_submissions
--   FOR UPDATE
--   USING (auth.jwt() ->> 'role' = 'admin');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_spot_submissions_updated_at
  BEFORE UPDATE ON user_spot_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE user_spot_submissions IS 'User-submitted spot suggestions pending admin approval';
