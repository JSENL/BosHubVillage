-- Fix linter warnings: set immutable search_path on functions

-- 1) update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2) delete_approved_submission
CREATE OR REPLACE FUNCTION public.delete_approved_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Only delete if the status was changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Use EXECUTE with TG_TABLE_NAME for dynamic table reference
    EXECUTE format('DELETE FROM %I WHERE id = $1', TG_TABLE_NAME) USING NEW.id;
    -- Return NULL to prevent the update from happening since we're deleting the record
    RETURN NULL;
  END IF;
  -- For other status changes, allow the update to proceed
  RETURN NEW;
END;
$$;

-- 3) has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;