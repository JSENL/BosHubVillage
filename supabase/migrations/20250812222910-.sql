-- Create event invitations table for private events
CREATE TABLE public.event_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  invited_user_id UUID NOT NULL,
  invited_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, invited_user_id)
);

-- Add privacy settings to events table
ALTER TABLE public.events 
ADD COLUMN is_private BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- Enable RLS on event invitations
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for event invitations
CREATE POLICY "Users can view their own invitations"
ON public.event_invitations
FOR SELECT
USING (auth.uid() = invited_user_id);

CREATE POLICY "Event creators can manage invitations for their events"
ON public.event_invitations
FOR ALL
USING (
  auth.uid() IN (
    SELECT created_by FROM public.events WHERE id = event_invitations.event_id
  )
);

CREATE POLICY "Admins can view all invitations"
ON public.event_invitations
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Update events RLS policies for private events
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

CREATE POLICY "Anyone can view public events"
ON public.events
FOR SELECT
USING (
  NOT is_private OR 
  has_role(auth.uid(), 'admin') OR
  auth.uid() = created_by OR
  auth.uid() IN (
    SELECT invited_user_id 
    FROM public.event_invitations 
    WHERE event_id = events.id
  )
);

-- Update existing events to have created_by filled where possible
UPDATE public.events 
SET created_by = (
  SELECT submitted_by 
  FROM public.event_submissions 
  WHERE event_submissions.title = events.title 
  AND event_submissions.status = 'approved' 
  LIMIT 1
) 
WHERE created_by IS NULL;