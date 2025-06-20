
-- Add RLS policies for admins to manage business submissions
CREATE POLICY "Admins can view all business submissions" ON public.business_submissions 
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update business submissions" ON public.business_submissions 
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to manage news submissions  
CREATE POLICY "Admins can view all news submissions" ON public.news_submissions 
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news submissions" ON public.news_submissions 
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policies for admins to manage event submissions
CREATE POLICY "Admins can view all event submissions" ON public.event_submissions 
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update event submissions" ON public.event_submissions 
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to insert into main tables when approving submissions
CREATE POLICY "Admins can insert approved businesses" ON public.business 
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert approved news" ON public.news 
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert approved events" ON public.events 
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
