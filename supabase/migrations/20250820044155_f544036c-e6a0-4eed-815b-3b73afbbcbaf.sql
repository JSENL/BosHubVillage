-- Remove proprietor role from existing users
DELETE FROM public.user_roles WHERE role = 'proprietor';

-- Remove the default value from role column temporarily
ALTER TABLE public.user_roles ALTER COLUMN role DROP DEFAULT;

-- Update the app_role enum to remove proprietor
-- First create a new enum without proprietor
CREATE TYPE public.app_role_new AS ENUM ('admin', 'moderator', 'user');

-- Update the user_roles table to use the new enum
ALTER TABLE public.user_roles ALTER COLUMN role TYPE app_role_new USING role::text::app_role_new;

-- Drop the old enum and rename the new one
DROP TYPE public.app_role;
ALTER TYPE public.app_role_new RENAME TO app_role;

-- Restore the default value
ALTER TABLE public.user_roles ALTER COLUMN role SET DEFAULT 'user'::app_role;

-- Update the has_role function to use the new enum
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;