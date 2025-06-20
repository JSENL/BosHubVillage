
-- Remove the existing time column and add start_time and end_time columns
ALTER TABLE public.events DROP COLUMN IF EXISTS time;

ALTER TABLE public.events ADD COLUMN start_time time without time zone;
ALTER TABLE public.events ADD COLUMN end_time time without time zone;

-- Also update the event_submissions table to match
ALTER TABLE public.event_submissions DROP COLUMN IF EXISTS time;

ALTER TABLE public.event_submissions ADD COLUMN start_time time without time zone;
ALTER TABLE public.event_submissions ADD COLUMN end_time time without time zone;
