
-- First, let's check what policies already exist and drop them if needed, then recreate all policies
DROP POLICY IF EXISTS "Anyone can view approved local resources submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Users can view their own local resources submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Authenticated users can create local resources submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Users can update their own pending local resources submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Admins can view all local resources submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Admins can update local resources submissions" ON public.local_resources_submissions;

-- Now create all the policies fresh
CREATE POLICY "Anyone can view approved local resources submissions" ON public.local_resources_submissions 
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own local resources submissions" ON public.local_resources_submissions 
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Authenticated users can create local resources submissions" ON public.local_resources_submissions 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = submitted_by);

CREATE POLICY "Users can update their own pending local resources submissions" ON public.local_resources_submissions 
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'pending');

CREATE POLICY "Admins can view all local resources submissions" ON public.local_resources_submissions 
  FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update local resources submissions" ON public.local_resources_submissions 
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Also add RLS policy for admins to insert into local_resources table when approving submissions
CREATE POLICY "Admins can insert approved local resources" ON public.local_resources 
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
