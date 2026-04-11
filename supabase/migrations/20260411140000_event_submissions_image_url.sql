-- Match news_submissions.image_url: nullable text for hero/cover URL on submissions
ALTER TABLE public.event_submissions ADD COLUMN image_url text DEFAULT NULL;
