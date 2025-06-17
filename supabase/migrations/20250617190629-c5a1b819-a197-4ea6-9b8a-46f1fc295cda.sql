
-- Add event_type field to events table
ALTER TABLE public.events 
ADD COLUMN event_type TEXT CHECK (event_type IN ('business', 'news', 'event')) DEFAULT 'event';

-- Add neighborhoods field to events table
ALTER TABLE public.events 
ADD COLUMN neighborhoods TEXT[];

-- Add event_type field to event_submissions table
ALTER TABLE public.event_submissions 
ADD COLUMN event_type TEXT CHECK (event_type IN ('business', 'news', 'event')) DEFAULT 'event';

-- Add neighborhoods field to event_submissions table
ALTER TABLE public.event_submissions 
ADD COLUMN neighborhoods TEXT[];

-- Update existing records to have a default event_type based on category
UPDATE public.events 
SET event_type = CASE 
  WHEN LOWER(category) LIKE '%business%' THEN 'business'
  WHEN LOWER(category) LIKE '%news%' THEN 'news'
  ELSE 'event'
END;

UPDATE public.event_submissions 
SET event_type = CASE 
  WHEN LOWER(category) LIKE '%business%' THEN 'business'
  WHEN LOWER(category) LIKE '%news%' THEN 'news'
  ELSE 'event'
END;
