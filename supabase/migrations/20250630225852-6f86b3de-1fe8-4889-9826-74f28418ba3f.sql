
-- Rename the main local services table to local_resources
ALTER TABLE public.local_services_nonprofits RENAME TO local_resources;

-- Rename the comments table
ALTER TABLE public.local_services_nonprofits_comments RENAME TO local_resources_comments;

-- Rename the submissions table
ALTER TABLE public.local_services_nonprofits_submissions RENAME TO local_resources_submissions;

-- Update foreign key references in the comments table
ALTER TABLE public.local_resources_comments 
  RENAME COLUMN local_service_nonprofit_id TO local_resource_id;

-- Update RLS policy names for local_resources table
DROP POLICY IF EXISTS "Allow public read access to local services and nonprofits" ON public.local_resources;
DROP POLICY IF EXISTS "Allow authenticated users to insert local services and nonprofits" ON public.local_resources;
DROP POLICY IF EXISTS "Allow authenticated users to update local services and nonprofits" ON public.local_resources;
DROP POLICY IF EXISTS "Allow authenticated users to delete local services and nonprofits" ON public.local_resources;

CREATE POLICY "Allow public read access to local resources"
  ON public.local_resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert local resources"
  ON public.local_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update local resources"
  ON public.local_resources
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete local resources"
  ON public.local_resources
  FOR DELETE
  TO authenticated
  USING (true);

-- Update RLS policy names for local_resources_comments table
DROP POLICY IF EXISTS "Anyone can view local services comments" ON public.local_resources_comments;
DROP POLICY IF EXISTS "Authenticated users can create local services comments" ON public.local_resources_comments;
DROP POLICY IF EXISTS "Users can update their own local services comments" ON public.local_resources_comments;
DROP POLICY IF EXISTS "Users can delete their own local services comments" ON public.local_resources_comments;

CREATE POLICY "Anyone can view local resources comments" 
  ON public.local_resources_comments 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create local resources comments" 
  ON public.local_resources_comments 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own local resources comments" 
  ON public.local_resources_comments 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own local resources comments" 
  ON public.local_resources_comments 
  FOR DELETE USING (auth.uid() = user_id);

-- Update RLS policy names for local_resources_submissions table
DROP POLICY IF EXISTS "Anyone can view approved local services submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Users can view their own local services submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Authenticated users can create local services submissions" ON public.local_resources_submissions;
DROP POLICY IF EXISTS "Users can update their own pending local services submissions" ON public.local_resources_submissions;

CREATE POLICY "Anyone can view approved local resources submissions" 
  ON public.local_resources_submissions 
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own local resources submissions" 
  ON public.local_resources_submissions 
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Authenticated users can create local resources submissions" 
  ON public.local_resources_submissions 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = submitted_by);

CREATE POLICY "Users can update their own pending local resources submissions" 
  ON public.local_resources_submissions 
  FOR UPDATE USING (auth.uid() = submitted_by AND status = 'pending');
