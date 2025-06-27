
-- Add latitude and longitude columns to the news table
ALTER TABLE public.news 
ADD COLUMN latitude numeric,
ADD COLUMN longitude numeric;
