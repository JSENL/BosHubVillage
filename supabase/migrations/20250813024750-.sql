-- Create table for news submission media
CREATE TABLE IF NOT EXISTS public.news_submission_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_submission_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RLS policies for news submission media
ALTER TABLE public.news_submission_media ENABLE ROW LEVEL SECURITY;

-- Anyone can view news submission media records
CREATE POLICY "Anyone can view news submission media records" 
ON public.news_submission_media FOR SELECT 
USING (true);

-- Authenticated users can insert news submission media records
CREATE POLICY "Authenticated users can insert news submission media records" 
ON public.news_submission_media FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own news submission media records
CREATE POLICY "Users can delete their own news submission media records" 
ON public.news_submission_media FOR DELETE 
USING (
  news_submission_id IN (
    SELECT id FROM news_submissions 
    WHERE submitted_by = auth.uid()
  )
);

-- Admins can delete any news submission media records
CREATE POLICY "Admins can delete any news submission media records" 
ON public.news_submission_media FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));