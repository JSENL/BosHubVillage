-- Fix critical security vulnerabilities: protect user emails, phone numbers, and private data

-- 1. Fix event_registrations: remove public access to user email/phone data
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;

-- Only allow users to see their own registrations
CREATE POLICY "Users can view their own registrations"
ON public.event_registrations
FOR SELECT
USING (auth.uid() = user_id);

-- Only allow admins to see all registrations
CREATE POLICY "Admins can view all registrations"
ON public.event_registrations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix user_roles: remove public read access to role information
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;

-- Only allow users to view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Keep admin access intact
-- (Existing "Admins can view all user roles" policy remains)

-- 3. Ensure contact_admin is properly secured (verify existing policies)
-- The existing policies should already be correct, but let's verify they exist:

-- Verify users can only see their own contact messages
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_admin' 
        AND policyname = 'Users can view their own contact admin messages'
    ) THEN
        CREATE POLICY "Users can view their own contact admin messages"
        ON public.contact_admin
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;