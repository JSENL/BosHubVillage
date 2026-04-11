-- Cover/hero image for published events (set on approve from submission or later on event page)
ALTER TABLE public.events ADD COLUMN image_url text DEFAULT NULL;
