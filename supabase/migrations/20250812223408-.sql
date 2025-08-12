-- Drop the problematic policy
DROP POLICY IF EXISTS "Anyone can view public events" ON public.events;

-- Create a security definer function to check if user can view event
CREATE OR REPLACE FUNCTION public.can_view_event(_event_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = _event_id
    AND (
      NOT e.is_private OR 
      public.has_role(_user_id, 'admin') OR
      e.created_by = _user_id OR
      EXISTS (
        SELECT 1 FROM public.event_invitations ei
        WHERE ei.event_id = _event_id 
        AND ei.invited_user_id = _user_id
      )
    )
  );
$$;

-- Create a simpler policy that doesn't cause recursion
CREATE POLICY "Users can view events they have access to"
ON public.events
FOR SELECT
USING (
  NOT is_private OR 
  has_role(auth.uid(), 'admin') OR
  auth.uid() = created_by OR
  auth.uid() IN (
    SELECT invited_user_id 
    FROM public.event_invitations 
    WHERE event_id = id
  )
);