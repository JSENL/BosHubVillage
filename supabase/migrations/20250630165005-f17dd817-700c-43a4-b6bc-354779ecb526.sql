
-- Add missing columns to news_submissions table
ALTER TABLE public.news_submissions 
ADD COLUMN IF NOT EXISTS "Address" text,
ADD COLUMN IF NOT EXISTS villages text[],
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric;
