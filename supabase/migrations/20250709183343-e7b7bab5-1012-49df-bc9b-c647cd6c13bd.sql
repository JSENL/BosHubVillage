
-- Add RLS policy for admins to delete businesses
CREATE POLICY "Admins can delete all businesses" ON public.business 
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));
