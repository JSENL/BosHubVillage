
-- Create local_services_nonprofits_submissions table
CREATE TABLE public.local_services_nonprofits_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  village TEXT,
  description TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create local_services_nonprofits_comments table
CREATE TABLE public.local_services_nonprofits_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  local_service_nonprofit_id UUID NOT NULL REFERENCES public.local_services_nonprofits(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  parent_comment_id UUID REFERENCES public.local_services_nonprofits_comments(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add updated_at triggers
CREATE TRIGGER update_local_services_nonprofits_submissions_updated_at
  BEFORE UPDATE ON public.local_services_nonprofits_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_local_services_nonprofits_comments_updated_at
  BEFORE UPDATE ON public.local_services_nonprofits_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on both tables
ALTER TABLE public.local_services_nonprofits_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_services_nonprofits_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for local_services_nonprofits_submissions
CREATE POLICY "Anyone can view approved local services submissions" ON public.local_services_nonprofits_submissions 
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view their own local services submissions" ON public.local_services_nonprofits_submissions 
  FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Authenticated users can create local services submissions" ON public.local_services_nonprofits_submissions 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = submitted_by);
CREATE POLICY "Users can update their own pending local services submissions" ON public.local_services_nonprofits_submissions 
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'pending');

-- RLS policies for local_services_nonprofits_comments
CREATE POLICY "Anyone can view local services comments" ON public.local_services_nonprofits_comments 
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create local services comments" ON public.local_services_nonprofits_comments 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
CREATE POLICY "Users can update their own local services comments" ON public.local_services_nonprofits_comments 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own local services comments" ON public.local_services_nonprofits_comments 
  FOR DELETE USING (auth.uid() = user_id);
