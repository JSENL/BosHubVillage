
-- Create business_submissions table
CREATE TABLE public.business_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  business_type TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news_submissions table
CREATE TABLE public.news_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  location TEXT NOT NULL,
  date_posted DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add updated_at triggers
CREATE TRIGGER update_business_submissions_updated_at
  BEFORE UPDATE ON public.business_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_submissions_updated_at
  BEFORE UPDATE ON public.news_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on submission tables
ALTER TABLE public.business_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_submissions
CREATE POLICY "Anyone can view approved business submissions" ON public.business_submissions 
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own business submissions" ON public.business_submissions 
  FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Authenticated users can create business submissions" ON public.business_submissions 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = submitted_by);
CREATE POLICY "Users can update their own pending business submissions" ON public.business_submissions 
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'pending');

-- RLS policies for news_submissions  
CREATE POLICY "Anyone can view approved news submissions" ON public.news_submissions 
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own news submissions" ON public.news_submissions 
  FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Authenticated users can create news submissions" ON public.news_submissions 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = submitted_by);
CREATE POLICY "Users can update their own pending news submissions" ON public.news_submissions 
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'pending');
