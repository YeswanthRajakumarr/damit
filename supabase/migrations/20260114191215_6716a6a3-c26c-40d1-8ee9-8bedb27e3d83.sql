-- Add column for 10k step goal achievement
ALTER TABLE public.daily_logs 
ADD COLUMN step_goal_reached numeric NULL;