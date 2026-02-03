-- Add emoji column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS emoji text;

-- Allow public read access (already covered by "Anyone can view profiles for public sharing" if it selects all, but good to be sure)
-- The error "column profiles.emoji does not exist" confirms we just need the column.
