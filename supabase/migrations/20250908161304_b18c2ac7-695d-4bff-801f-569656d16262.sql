-- Allow admins to delete event and news submissions
CREATE POLICY IF NOT EXISTS "Admins can delete event submissions" 
ON public.event_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role'));

CREATE POLICY IF NOT EXISTS "Admins can delete news submissions" 
ON public.news_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role'));
