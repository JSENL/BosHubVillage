
-- Update existing events to add start_time and end_time values
-- This will add sample times to events that currently have NULL values

UPDATE public.events 
SET 
  start_time = CASE 
    WHEN EXTRACT(HOUR FROM created_at) < 12 THEN '09:00:00'::time
    WHEN EXTRACT(HOUR FROM created_at) < 16 THEN '14:00:00'::time
    ELSE '19:00:00'::time
  END,
  end_time = CASE 
    WHEN EXTRACT(HOUR FROM created_at) < 12 THEN '11:00:00'::time
    WHEN EXTRACT(HOUR FROM created_at) < 16 THEN '16:00:00'::time
    ELSE '21:00:00'::time
  END
WHERE start_time IS NULL OR end_time IS NULL;
