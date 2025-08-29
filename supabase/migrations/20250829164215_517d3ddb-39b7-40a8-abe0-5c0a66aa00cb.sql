-- Enhance profiles table with social features
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS following_count INTEGER NOT NULL DEFAULT 0;

-- Create user followers table for social connections
CREATE TABLE IF NOT EXISTS public.user_followers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Create user bookmarks table for saved content
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'event', 'business', 'news', 'local_service'
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create user activity feed table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'comment', 'bookmark', 'follow', 'submit'
  item_type TEXT, -- 'event', 'business', 'news', 'local_service', 'user'
  item_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trending content tracking table
CREATE TABLE IF NOT EXISTS public.trending_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  bookmark_count INTEGER NOT NULL DEFAULT 0,
  score NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_type, item_id)
);

-- Create recently viewed table
CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_followers
CREATE POLICY "Users can view followers/following relationships" 
ON public.user_followers FOR SELECT USING (true);

CREATE POLICY "Users can follow others" 
ON public.user_followers FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
ON public.user_followers FOR DELETE 
USING (auth.uid() = follower_id);

-- RLS Policies for user_bookmarks
CREATE POLICY "Users can view their own bookmarks" 
ON public.user_bookmarks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
ON public.user_bookmarks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
ON public.user_bookmarks FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for user_activities
CREATE POLICY "Users can view activities of people they follow" 
ON public.user_activities FOR SELECT 
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.user_followers 
    WHERE follower_id = auth.uid() AND following_id = user_activities.user_id
  ) OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can create their own activities" 
ON public.user_activities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for trending_content
CREATE POLICY "Anyone can view trending content" 
ON public.trending_content FOR SELECT USING (true);

CREATE POLICY "Only admins can manage trending content" 
ON public.trending_content FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for recently_viewed
CREATE POLICY "Users can view their own recently viewed items" 
ON public.recently_viewed FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their recently viewed" 
ON public.recently_viewed FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their recently viewed" 
ON public.recently_viewed FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following count for follower
    UPDATE public.profiles 
    SET following_count = following_count + 1 
    WHERE id = NEW.follower_id;
    
    -- Increment followers count for the followed user
    UPDATE public.profiles 
    SET followers_count = followers_count + 1 
    WHERE id = NEW.following_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following count for follower
    UPDATE public.profiles 
    SET following_count = following_count - 1 
    WHERE id = OLD.follower_id;
    
    -- Decrement followers count for the unfollowed user
    UPDATE public.profiles 
    SET followers_count = followers_count - 1 
    WHERE id = OLD.following_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update follower counts
CREATE TRIGGER update_follower_counts_trigger
  AFTER INSERT OR DELETE ON public.user_followers
  FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

-- Function to handle upsert for recently viewed
CREATE OR REPLACE FUNCTION upsert_recently_viewed()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.recently_viewed (user_id, item_type, item_id, viewed_at)
  VALUES (NEW.user_id, NEW.item_type, NEW.item_id, now())
  ON CONFLICT (user_id, item_type, item_id)
  DO UPDATE SET viewed_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_followers_follower_id ON public.user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_following_id ON public.user_followers(following_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_item ON public.user_bookmarks(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_content_score ON public.trending_content(score DESC);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON public.recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_viewed_at ON public.recently_viewed(viewed_at DESC);