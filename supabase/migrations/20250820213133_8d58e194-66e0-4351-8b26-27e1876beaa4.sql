-- Add is_owner field to business_submissions table
ALTER TABLE public.business_submissions 
ADD COLUMN is_owner boolean DEFAULT false;