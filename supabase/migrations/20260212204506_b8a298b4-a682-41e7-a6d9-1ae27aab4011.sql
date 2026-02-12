-- Add image_url column to news table
ALTER TABLE public.news ADD COLUMN image_url text DEFAULT NULL;

-- Add image_url column to news_submissions table (for future submissions that get approved)
ALTER TABLE public.news_submissions ADD COLUMN image_url text DEFAULT NULL;