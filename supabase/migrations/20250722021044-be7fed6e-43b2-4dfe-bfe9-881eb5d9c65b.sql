-- Fix the trigger function to properly use TG_TABLE_NAME
CREATE OR REPLACE FUNCTION public.delete_approved_submission()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;