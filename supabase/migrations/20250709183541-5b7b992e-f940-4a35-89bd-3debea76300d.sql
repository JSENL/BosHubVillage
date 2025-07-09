
-- Add RLS policy for admins to delete local resources
CREATE POLICY "Admins can delete all local resources" ON public.local_resources 
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));
