-- Create storage bucket for business message media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-message-media', 'business-message-media', true);

-- Create table to track media files for business messages
CREATE TABLE public.business_message_media (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_message_id uuid NOT NULL REFERENCES public.business_messages(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on the media table
ALTER TABLE public.business_message_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for business message media
CREATE POLICY "Users can view business message media"
ON public.business_message_media
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert business message media"
ON public.business_message_media
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own business message media"
ON public.business_message_media
FOR DELETE
USING (
  business_message_id IN (
    SELECT bm.id 
    FROM public.business_messages bm
    WHERE bm.sender_id = auth.uid()
  )
);

-- Storage policies for business message media bucket
CREATE POLICY "Business message media is publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'business-message-media');

CREATE POLICY "Authenticated users can upload business message media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'business-message-media' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own business message media"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'business-message-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own business message media"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'business-message-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Index for better performance
CREATE INDEX idx_business_message_media_message_id ON public.business_message_media(business_message_id);