-- Allow verified business owners to update their listing (e.g. cover image on detail page)
CREATE POLICY "Business owners can update businesses they own"
ON public.business
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.business_owner bo
    WHERE bo.business_id = business.id
      AND bo.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.business_owner bo
    WHERE bo.business_id = business.id
      AND bo.owner_id = auth.uid()
  )
);
