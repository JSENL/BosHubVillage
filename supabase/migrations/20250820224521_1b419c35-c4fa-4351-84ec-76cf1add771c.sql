-- Function to safely resolve a business owner id for messaging
CREATE OR REPLACE FUNCTION public.get_business_owner_id(_business_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO public
AS $$
  WITH owner AS (
    SELECT owner_id
    FROM public.business_owner
    WHERE business_id = _business_id
    LIMIT 1
  )
  SELECT COALESCE(
    (SELECT owner_id FROM owner),
    (SELECT created_by FROM public.business WHERE id = _business_id)
  );
$$;

-- Ensure execute privileges (granted to authenticated by default)
REVOKE ALL ON FUNCTION public.get_business_owner_id(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_business_owner_id(uuid) TO authenticated;