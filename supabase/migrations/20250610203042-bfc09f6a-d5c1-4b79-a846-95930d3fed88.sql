
-- Add latitude and longitude columns to event_submissions table
ALTER TABLE public.event_submissions 
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;
