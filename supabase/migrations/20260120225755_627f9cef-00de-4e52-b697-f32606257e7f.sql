-- Create a junction table for linking content items to news articles
CREATE TABLE public.content_news_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('business', 'event', 'local_service')),
  content_id UUID NOT NULL,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(content_type, content_id, news_id)
);

-- Enable Row Level Security
ALTER TABLE public.content_news_links ENABLE ROW LEVEL SECURITY;

-- Anyone can view links
CREATE POLICY "Anyone can view content news links" 
ON public.content_news_links 
FOR SELECT 
USING (true);

-- Business owners can add links to their businesses
CREATE POLICY "Business owners can add news links" 
ON public.content_news_links 
FOR INSERT 
WITH CHECK (
  content_type = 'business' AND (
    EXISTS (
      SELECT 1 FROM public.business_owner 
      WHERE business_id = content_id AND owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.business 
      WHERE id = content_id AND created_by = auth.uid()
    )
  )
  OR
  -- Event creators can add links
  content_type = 'event' AND (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE id = content_id AND created_by = auth.uid()
    )
  )
  OR
  -- Admins can add any links
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Users can delete their own links, admins can delete any
CREATE POLICY "Users can delete their own news links" 
ON public.content_news_links 
FOR DELETE 
USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create index for faster lookups
CREATE INDEX idx_content_news_links_content ON public.content_news_links(content_type, content_id);
CREATE INDEX idx_content_news_links_news ON public.content_news_links(news_id);