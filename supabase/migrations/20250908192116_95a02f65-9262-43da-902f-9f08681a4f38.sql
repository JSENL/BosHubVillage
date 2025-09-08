-- Create function to handle approved event submissions
CREATE OR REPLACE FUNCTION public.handle_approved_event_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Insert into events table
    INSERT INTO public.events (
      title,
      description,
      category,
      event_type,
      date,
      start_time,
      end_time,
      location,
      address,
      price,
      max_attendees,
      is_recurring,
      recurring_pattern,
      registration_required,
      latitude,
      longitude,
      neighborhoods,
      villages,
      website_link,
      created_by
    )
    VALUES (
      NEW.title,
      NEW.description,
      NEW.category,
      NEW.event_type,
      NEW.date,
      NEW.start_time,
      NEW.end_time,
      NEW.location,
      NEW.location, -- Use location as address if no specific address field
      NEW.price,
      NEW.max_attendees,
      NEW.is_recurring,
      NEW.recurring_pattern,
      NEW.registration_required,
      NEW.latitude,
      NEW.longitude,
      array_to_string(NEW.neighborhoods, ','),
      NEW.villages,
      NEW.website_link,
      NEW.submitted_by
    );
    
    -- Delete the submission since it's now in the main table
    DELETE FROM public.event_submissions WHERE id = NEW.id;
    
    -- Return NULL to prevent the UPDATE from happening since we deleted the record
    RETURN NULL;
  END IF;
  
  -- For other status changes, allow the update to proceed
  RETURN NEW;
END;
$function$;

-- Create trigger for event submissions
DROP TRIGGER IF EXISTS handle_approved_event_submission_trigger ON public.event_submissions;
CREATE TRIGGER handle_approved_event_submission_trigger
  BEFORE UPDATE ON public.event_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_approved_event_submission();

-- Manually move the existing approved event submission
DO $$
DECLARE
  submission_record RECORD;
BEGIN
  -- Get the approved submission
  SELECT * INTO submission_record 
  FROM public.event_submissions 
  WHERE id = '9969e163-dd8d-4da1-94ed-d0022444beec' AND status = 'approved';
  
  IF FOUND THEN
    -- Insert into events table
    INSERT INTO public.events (
      title,
      description,
      category,
      event_type,
      date,
      start_time,
      end_time,
      location,
      price,
      max_attendees,
      is_recurring,
      recurring_pattern,
      registration_required,
      latitude,
      longitude,
      neighborhoods,
      villages,
      website_link,
      created_by
    )
    VALUES (
      submission_record.title,
      submission_record.description,
      submission_record.category,
      submission_record.event_type,
      submission_record.date,
      submission_record.start_time,
      submission_record.end_time,
      submission_record.location,
      submission_record.price,
      submission_record.max_attendees,
      submission_record.is_recurring,
      submission_record.recurring_pattern,
      submission_record.registration_required,
      submission_record.latitude,
      submission_record.longitude,
      array_to_string(submission_record.neighborhoods, ','),
      submission_record.villages,
      submission_record.website_link,
      submission_record.submitted_by
    );
    
    -- Delete the submission
    DELETE FROM public.event_submissions WHERE id = submission_record.id;
  END IF;
END $$;