-- Add sponsored/special marker fields to all map-displayed tables
ALTER TABLE events ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE business ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE local_resources ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE news ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance when filtering sponsored items
CREATE INDEX idx_events_sponsored ON events(is_sponsored) WHERE is_sponsored = true;
CREATE INDEX idx_business_sponsored ON business(is_sponsored) WHERE is_sponsored = true;
CREATE INDEX idx_local_resources_sponsored ON local_resources(is_sponsored) WHERE is_sponsored = true;
CREATE INDEX idx_news_sponsored ON news(is_sponsored) WHERE is_sponsored = true;

-- Add sponsored fields to submission tables for future submissions
ALTER TABLE event_submissions ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE business_submissions ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE local_resources_submissions ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE news_submissions ADD COLUMN is_sponsored BOOLEAN DEFAULT FALSE;

-- Update the event submission approval trigger to include sponsored status
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
      created_by,
      is_sponsored
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
      NEW.location,
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
      NEW.submitted_by,
      NEW.is_sponsored
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