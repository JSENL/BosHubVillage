
-- Add latitude and longitude columns to business_submissions table for geocoding
ALTER TABLE business_submissions 
ADD COLUMN latitude numeric,
ADD COLUMN longitude numeric;
