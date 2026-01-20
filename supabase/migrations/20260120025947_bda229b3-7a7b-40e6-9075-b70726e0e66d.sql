-- Add policy for admins to update any business (including sponsored status)
CREATE POLICY "Admins can update all businesses"
ON public.business
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));