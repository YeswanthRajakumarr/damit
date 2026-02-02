-- Add photo_url column to daily_logs
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Create a storage bucket for log photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('log-photos', 'log-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the storage bucket
-- Allow users to upload their own photos
CREATE POLICY "Users can upload their own log photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'log-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own photos
CREATE POLICY "Users can view their own log photos"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'log-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own log photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'log-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
