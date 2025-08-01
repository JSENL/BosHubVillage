-- Fix security warning by setting search_path for the new function
CREATE OR REPLACE FUNCTION handle_approved_local_resources_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Insert into local_resources table
    INSERT INTO public.local_resources (
      name,
      category,
      address,
      neighborhood,
      village,
      description,
      latitude,
      longitude
    )
    VALUES (
      NEW.name,
      NEW.category,
      NEW.address,
      NEW.neighborhood,
      NEW.village,
      NEW.description,
      NEW.latitude,
      NEW.longitude
    );
    
    -- Delete the submission since it's now in the main table
    DELETE FROM public.local_resources_submissions WHERE id = NEW.id;
    
    -- Return NULL to prevent the UPDATE from happening since we deleted the record
    RETURN NULL;
  END IF;
  
  -- For other status changes, allow the update to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';