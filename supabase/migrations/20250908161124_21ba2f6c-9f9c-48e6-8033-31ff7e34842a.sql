-- Update the RLS policy for events table to allow admins to create events on behalf of users
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;

CREATE POLICY "Users and admins can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL) AND 
  (
    (auth.uid() = created_by) OR 
    has_role(auth.uid(), 'admin'::app_role)
  )
);