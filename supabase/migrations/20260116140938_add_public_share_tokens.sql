-- Add public share token system to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS share_token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS share_enabled BOOLEAN DEFAULT false;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_profiles_share_token ON profiles(share_token) WHERE share_token IS NOT NULL;

-- Function to generate a random token
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to regenerate share token for a user
CREATE OR REPLACE FUNCTION regenerate_share_token(user_id UUID, expiry_days INTEGER DEFAULT 30)
RETURNS TABLE(token TEXT, expires_at TIMESTAMPTZ) AS $$
DECLARE
  new_token TEXT;
  new_expiry TIMESTAMPTZ;
BEGIN
  new_token := generate_share_token();
  new_expiry := NOW() + (expiry_days || ' days')::INTERVAL;
  
  UPDATE profiles
  SET 
    share_token = new_token,
    share_token_expires_at = new_expiry,
    share_enabled = true
  WHERE id = user_id;
  
  RETURN QUERY SELECT new_token, new_expiry;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to disable sharing
CREATE OR REPLACE FUNCTION disable_sharing(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles
  SET 
    share_enabled = false,
    share_token = NULL,
    share_token_expires_at = NULL
  WHERE id = user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policy for public access via token
DROP POLICY IF EXISTS "Public profiles are viewable by token" ON profiles;
CREATE POLICY "Public profiles are viewable by token"
ON profiles FOR SELECT
USING (
  share_enabled = true 
  AND share_token IS NOT NULL 
  AND (share_token_expires_at IS NULL OR share_token_expires_at > NOW())
);

-- Update RLS policy for daily_logs to use token-based access
DROP POLICY IF EXISTS "Public logs viewable via share token" ON daily_logs;
CREATE POLICY "Public logs viewable via share token"
ON daily_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = daily_logs.user_id
    AND profiles.share_enabled = true
    AND profiles.share_token IS NOT NULL
    AND (profiles.share_token_expires_at IS NULL OR profiles.share_token_expires_at > NOW())
  )
);
