-- =====================================================
-- SECURITY HARDENING MIGRATION
-- =====================================================

-- 1. FIX: Restrict in_app_notifications INSERT to prevent fake notification spam
-- Drop the overly permissive policy and create a proper one
DROP POLICY IF EXISTS "System can create notifications" ON public.in_app_notifications;

-- Only allow service role (edge functions) or users creating notifications for themselves
CREATE POLICY "Users can create their own notifications"
ON public.in_app_notifications
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- 2. FIX: Restrict event_attendees visibility to relevant parties only
DROP POLICY IF EXISTS "Users can view event attendees" ON public.event_attendees;

CREATE POLICY "Users can view event attendees for their events or own registrations"
ON public.event_attendees
FOR SELECT
USING (
  -- User can see their own registrations
  auth.uid() = user_id OR
  -- Event creators can see attendees for their events
  EXISTS (
    SELECT 1 FROM public.events e 
    WHERE e.id = event_attendees.event_id 
    AND e.created_by = auth.uid()
  ) OR
  -- Admins can see all
  has_role(auth.uid(), 'admin'::app_role)
);

-- 3. FIX: Add verification check for business_owner claims
-- First, add a verified column if it doesn't exist
ALTER TABLE public.business_owner 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can create their own business ownership" ON public.business_owner;

-- New policy: Users can claim ownership but it needs admin verification
CREATE POLICY "Users can create unverified business ownership claims"
ON public.business_owner
FOR INSERT
WITH CHECK (
  auth.uid() = owner_id AND is_verified = false
);

-- Update the view policy to allow seeing pending claims
DROP POLICY IF EXISTS "Users can view their own business ownership" ON public.business_owner;

CREATE POLICY "Users can view their own or verified business ownership"
ON public.business_owner
FOR SELECT
USING (
  auth.uid() = owner_id OR
  is_verified = true OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- 4. FIX: Strengthen user_followers visibility (require authentication)
DROP POLICY IF EXISTS "Anyone can view follower relationships" ON public.user_followers;

CREATE POLICY "Authenticated users can view follower relationships"
ON public.user_followers
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 5. FIX: Strengthen admin_user_messages UPDATE policy
DROP POLICY IF EXISTS "Users can update status of their received admin messages" ON public.admin_user_messages;

CREATE POLICY "Users can update status of their received admin messages"
ON public.admin_user_messages
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. FIX: Strengthen business_messages policy to verify ownership
DROP POLICY IF EXISTS "Business owners can view all messages for their businesses" ON public.business_messages;

CREATE POLICY "Business owners and participants can view relevant messages"
ON public.business_messages
FOR SELECT
USING (
  -- Message sender or recipient
  auth.uid() = sender_id OR
  auth.uid() = recipient_id OR
  -- Verified business owner
  EXISTS (
    SELECT 1 FROM public.business_owner bo
    WHERE bo.business_id = business_messages.business_id
    AND bo.owner_id = auth.uid()
    AND bo.is_verified = true
  ) OR
  -- Admin access
  has_role(auth.uid(), 'admin'::app_role)
);

-- 7. Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on audit log - only admins can view
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
ON public.security_audit_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);

-- 8. Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'admin'::app_role) THEN
    INSERT INTO public.security_audit_log (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values
    ) VALUES (
      auth.uid(),
      TG_OP,
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
    );
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- 9. Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_user_roles_changes ON public.user_roles;
CREATE TRIGGER audit_user_roles_changes
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

DROP TRIGGER IF EXISTS audit_business_owner_changes ON public.business_owner;
CREATE TRIGGER audit_business_owner_changes
AFTER INSERT OR UPDATE OR DELETE ON public.business_owner
FOR EACH ROW EXECUTE FUNCTION public.log_admin_action();

-- 10. Add index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON public.security_audit_log(action);