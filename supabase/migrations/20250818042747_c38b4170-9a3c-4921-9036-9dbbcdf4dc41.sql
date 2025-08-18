-- Harden contact_admin access: prevent public reads and impersonation on inserts
-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.contact_admin ENABLE ROW LEVEL SECURITY;

-- Replace broad insert policy with strict ownership check
DROP POLICY IF EXISTS "Authenticated users can create contact admin messages" ON public.contact_admin;

CREATE POLICY "Users can create their own contact admin messages"
ON public.contact_admin
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Preserve existing safe read policies (owners and admins)
-- (Assumes these already exist as per current schema)
-- CREATE POLICY "Users can view their own contact admin messages" ...
-- CREATE POLICY "Admins can view all contact admin messages" ...
