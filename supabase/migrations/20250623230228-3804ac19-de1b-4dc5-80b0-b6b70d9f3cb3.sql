
-- Add Link column to news_submissions table
ALTER TABLE public.news_submissions 
ADD COLUMN link TEXT;

-- Add Villages column to events table
ALTER TABLE public.events 
ADD COLUMN villages TEXT[];

-- Add Villages column to news table
ALTER TABLE public.news 
ADD COLUMN villages TEXT[];

-- Add Villages column to business table
ALTER TABLE public.business 
ADD COLUMN villages TEXT[];
