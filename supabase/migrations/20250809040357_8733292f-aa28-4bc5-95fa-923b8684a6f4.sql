-- Add permanently_closed column to local_resources table
ALTER TABLE public.local_resources 
ADD COLUMN permanently_closed boolean NOT NULL DEFAULT false;