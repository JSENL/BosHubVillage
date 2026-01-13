-- Remove remaining overly permissive RLS policies on local_resources
DROP POLICY IF EXISTS "Allow authenticated users to delete local resources" ON public.local_resources;
DROP POLICY IF EXISTS "Allow authenticated users to insert local resources" ON public.local_resources;
DROP POLICY IF EXISTS "Allow authenticated users to update local resources" ON public.local_resources;