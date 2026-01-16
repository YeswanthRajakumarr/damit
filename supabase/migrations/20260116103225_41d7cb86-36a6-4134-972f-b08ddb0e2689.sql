-- Allow public read access to profiles for sharing feature
CREATE POLICY "Anyone can view profiles for public sharing" 
ON public.profiles 
FOR SELECT 
TO public
USING (true);

-- Allow public read access to daily logs for sharing feature
CREATE POLICY "Anyone can view logs for public sharing" 
ON public.daily_logs 
FOR SELECT 
TO public
USING (true);