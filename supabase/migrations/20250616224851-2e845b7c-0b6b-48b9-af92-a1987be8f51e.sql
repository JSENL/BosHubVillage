
-- Create a storage bucket for comment media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comment-media', 'comment-media', true);

-- Create RLS policies for the comment-media bucket
CREATE POLICY "Anyone can view comment media" ON storage.objects
FOR SELECT USING (bucket_id = 'comment-media');

CREATE POLICY "Authenticated users can upload comment media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'comment-media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own comment media" ON storage.objects
FOR DELETE USING (bucket_id = 'comment-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create a table to store comment media references
CREATE TABLE public.comment_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.event_comments(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comment_media table
ALTER TABLE public.comment_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for comment_media
CREATE POLICY "Anyone can view comment media records" ON public.comment_media
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comment media records" ON public.comment_media
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own comment media records" ON public.comment_media
FOR DELETE USING (
  comment_id IN (
    SELECT id FROM public.event_comments WHERE user_id = auth.uid()
  )
);
