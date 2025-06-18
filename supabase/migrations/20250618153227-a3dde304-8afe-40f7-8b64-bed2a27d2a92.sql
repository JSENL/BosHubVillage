
-- Create business table
CREATE TABLE public.business (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  business_type TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create news table  
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  location TEXT NOT NULL,
  date_posted DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create business_comments table
CREATE TABLE public.business_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.business(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  parent_comment_id UUID REFERENCES public.business_comments(id)
);

-- Create news_comments table
CREATE TABLE public.news_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  parent_comment_id UUID REFERENCES public.news_comments(id)
);

-- Add updated_at triggers
CREATE TRIGGER update_business_updated_at
  BEFORE UPDATE ON public.business
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_comments_updated_at
  BEFORE UPDATE ON public.business_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_comments_updated_at
  BEFORE UPDATE ON public.news_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.business ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for business table (public read, authenticated write)
CREATE POLICY "Anyone can view business" ON public.business FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create business" ON public.business FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own business" ON public.business FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own business" ON public.business FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for news table (public read, authenticated write)
CREATE POLICY "Anyone can view news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create news" ON public.news FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own news" ON public.news FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete their own news" ON public.news FOR DELETE USING (auth.uid() = created_by);

-- RLS policies for business_comments (public read, authenticated write)
CREATE POLICY "Anyone can view business comments" ON public.business_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create business comments" ON public.business_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own business comments" ON public.business_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own business comments" ON public.business_comments FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for news_comments (public read, authenticated write)
CREATE POLICY "Anyone can view news comments" ON public.news_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create news comments" ON public.news_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own news comments" ON public.news_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own news comments" ON public.news_comments FOR DELETE USING (auth.uid() = user_id);
