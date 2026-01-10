-- Create table for daily DAM logs
CREATE TABLE public.daily_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    diet DECIMAL,
    energy_level DECIMAL,
    stress_fatigue DECIMAL,
    workout DECIMAL,
    water_intake DECIMAL,
    sleep_last_night DECIMAL,
    cravings DECIMAL,
    hunger_level DECIMAL,
    good_thing TEXT,
    step_count INTEGER,
    proud_of_yourself TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(log_date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no auth needed for this simple app)
CREATE POLICY "Anyone can view daily logs" 
ON public.daily_logs 
FOR SELECT 
USING (true);

-- Allow public insert access
CREATE POLICY "Anyone can create daily logs" 
ON public.daily_logs 
FOR INSERT 
WITH CHECK (true);

-- Allow public update access
CREATE POLICY "Anyone can update daily logs" 
ON public.daily_logs 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_logs_updated_at
BEFORE UPDATE ON public.daily_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();