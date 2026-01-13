-- Fix overly permissive RLS policies on local_resources table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert local resources" ON public.local_resources;
DROP POLICY IF EXISTS "Authenticated users can update local resources" ON public.local_resources;
DROP POLICY IF EXISTS "Authenticated users can delete local resources" ON public.local_resources;

-- Create new restrictive policies - only admins can insert/update/delete
CREATE POLICY "Admins can insert local resources" 
ON public.local_resources 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update local resources" 
ON public.local_resources 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete local resources" 
ON public.local_resources 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));