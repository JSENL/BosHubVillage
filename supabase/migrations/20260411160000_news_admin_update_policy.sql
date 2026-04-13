-- Allow admins to update published culture articles (e.g. image_url from dashboard)
CREATE POLICY "Admins can update published news"
ON public.news
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
