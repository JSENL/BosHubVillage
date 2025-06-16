
-- Add parent_comment_id column to event_comments table for nested replies
ALTER TABLE public.event_comments 
ADD COLUMN parent_comment_id UUID REFERENCES public.event_comments(id) ON DELETE CASCADE;

-- Create an index for better performance when querying replies
CREATE INDEX idx_event_comments_parent_id ON public.event_comments(parent_comment_id);
