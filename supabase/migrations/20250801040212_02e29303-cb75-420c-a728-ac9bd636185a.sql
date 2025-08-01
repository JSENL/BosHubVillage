-- Add website_link column to all submission and main tables
ALTER TABLE public.events 
ADD COLUMN website_link text;

ALTER TABLE public.event_submissions 
ADD COLUMN website_link text;

ALTER TABLE public.business 
ADD COLUMN website_link text;

ALTER TABLE public.business_submissions 
ADD COLUMN website_link text;

ALTER TABLE public.local_resources 
ADD COLUMN website_link text;

ALTER TABLE public.local_resources_submissions 
ADD COLUMN website_link text;