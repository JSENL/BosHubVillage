-- Update some events to have future dates so they appear on the map
UPDATE public.events 
SET date = CURRENT_DATE + INTERVAL '7 days'
WHERE id IN (
  SELECT id FROM public.events 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL 
  LIMIT 5
);

-- Update a few more events to have different future dates
UPDATE public.events 
SET date = CURRENT_DATE + INTERVAL '14 days'
WHERE id IN (
  SELECT id FROM public.events 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL 
  AND date != CURRENT_DATE + INTERVAL '7 days'
  LIMIT 3
);