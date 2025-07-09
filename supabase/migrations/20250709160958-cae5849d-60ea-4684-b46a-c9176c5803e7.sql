
-- Make the 'id' field nullable for events table to allow CSV imports
-- The gen_random_uuid() default will still generate IDs when not provided
ALTER TABLE public.events ALTER COLUMN id DROP NOT NULL;

-- Make the 'id' field nullable for business table
ALTER TABLE public.business ALTER COLUMN id DROP NOT NULL;

-- Make the 'id' field nullable for news table  
ALTER TABLE public.news ALTER COLUMN id DROP NOT NULL;

-- Make the 'id' field nullable for local_resources table
ALTER TABLE public.local_resources ALTER COLUMN id DROP NOT NULL;

-- Make the 'id' field nullable for all submission tables
ALTER TABLE public.event_submissions ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.business_submissions ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.news_submissions ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.local_resources_submissions ALTER COLUMN id DROP NOT NULL;

-- Make the 'id' field nullable for comment tables
ALTER TABLE public.event_comments ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.business_comments ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.news_comments ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.local_resources_comments ALTER COLUMN id DROP NOT NULL;

-- Make the 'id' field nullable for other tables
ALTER TABLE public.event_attendees ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.comment_media ALTER COLUMN id DROP NOT NULL;
ALTER TABLE public.user_roles ALTER COLUMN id DROP NOT NULL;
