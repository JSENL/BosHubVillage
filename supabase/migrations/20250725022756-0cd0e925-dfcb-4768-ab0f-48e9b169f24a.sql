-- Fix security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.move_approved_business_submission()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only process if the status was changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Insert into the main business table
    INSERT INTO public.business (
      title,
      business_type,
      address,
      neighborhood,
      description,
      short_description,
      villages,
      latitude,
      longitude,
      created_by,
      created_at,
      updated_at
    )
    VALUES (
      NEW.title,
      NEW.business_type,
      NEW.address,
      NEW.neighborhood,
      NEW.description,
      NEW.short_description,
      NULL, -- villages field doesn't exist in submissions but exists in main table
      NEW.latitude,
      NEW.longitude,
      NEW.submitted_by, -- map submitted_by to created_by
      NEW.created_at,
      NEW.updated_at
    );
    
    -- Delete the submission record since it's now in the main table
    DELETE FROM public.business_submissions WHERE id = NEW.id;
    
    -- Return NULL to prevent the update from happening since we're deleting the record
    RETURN NULL;
  END IF;
  
  -- For other status changes, allow the update to proceed
  RETURN NEW;
END;
$$;