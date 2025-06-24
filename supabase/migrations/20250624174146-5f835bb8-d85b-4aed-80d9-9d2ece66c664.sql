
-- Add parent_comment_id to event_comments table for reply functionality
ALTER TABLE public.event_comments 
ADD COLUMN IF NOT EXISTS parent_comment_id UUID REFERENCES public.event_comments(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_comments_parent ON public.event_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_business_comments_business ON public.business_comments(business_id);
CREATE INDEX IF NOT EXISTS idx_business_comments_parent ON public.business_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_news ON public.news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_parent ON public.news_comments(parent_comment_id);

-- Add triggers for updated_at columns
CREATE OR REPLACE TRIGGER update_event_comments_updated_at
    BEFORE UPDATE ON public.event_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_business_comments_updated_at
    BEFORE UPDATE ON public.business_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_news_comments_updated_at
    BEFORE UPDATE ON public.news_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
