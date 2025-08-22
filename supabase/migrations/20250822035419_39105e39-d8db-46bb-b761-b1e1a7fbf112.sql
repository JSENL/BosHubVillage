BEGIN;

-- Restrict admin visibility to only messages they sent
DROP POLICY IF EXISTS "Admins can view all admin messages" ON public.admin_user_messages;

CREATE POLICY "Admins can view their sent admin messages"
ON public.admin_user_messages
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = admin_id
);

COMMIT;