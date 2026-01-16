-- Allow public read access to profiles for sharing feature
-- This policy allows anyone (including unauthenticated users) to view any profile
CREATE POLICY "Anyone can view profiles for public sharing" 
ON public.profiles 
FOR SELECT 
TO public
USING (true);

-- Allow public read access to daily logs for sharing feature
-- This policy allows anyone (including unauthenticated users) to view any daily log
CREATE POLICY "Anyone can view logs for public sharing" 
ON public.daily_logs 
FOR SELECT 
TO public
USING (true);
