-- Update RLS policies to allow admin deletion of users

-- Drop existing restrictive policies on user_roles if they exist
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

-- Create new policies for user_roles that allow admin deletion
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role to delete from user_roles (for edge functions)
CREATE POLICY "Service role can delete user roles"
ON public.user_roles
FOR DELETE
USING (auth.jwt() ->> 'role' = 'service_role');

-- Update profiles table policies to allow admin deletion
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can delete any profile"
ON public.profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role to delete from profiles (for edge functions)
CREATE POLICY "Service role can delete profiles"
ON public.profiles
FOR DELETE
USING (auth.jwt() ->> 'role' = 'service_role');