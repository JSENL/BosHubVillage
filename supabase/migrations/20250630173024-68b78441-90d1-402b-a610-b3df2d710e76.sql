
-- Add latitude and longitude columns to the business table
ALTER TABLE public.business 
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC;
