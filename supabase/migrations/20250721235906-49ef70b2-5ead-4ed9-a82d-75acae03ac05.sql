-- Create triggers to automatically delete approved submissions after they're processed

-- Function to delete approved submissions
CREATE OR REPLACE FUNCTION public.delete_approved_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Only delete if the status was changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Delete the approved submission record
    DELETE FROM TG_TABLE_NAME WHERE id = NEW.id;
    -- Return NULL to prevent the update from happening since we're deleting the record
    RETURN NULL;
  END IF;
  -- For other status changes, allow the update to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for event_submissions
CREATE TRIGGER delete_approved_event_submission
  AFTER UPDATE ON public.event_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_approved_submission();

-- Create trigger for news_submissions  
CREATE TRIGGER delete_approved_news_submission
  AFTER UPDATE ON public.news_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_approved_submission();

-- Create trigger for business_submissions
CREATE TRIGGER delete_approved_business_submission
  AFTER UPDATE ON public.business_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_approved_submission();

-- Create trigger for local_resources_submissions
CREATE TRIGGER delete_approved_local_resources_submission
  AFTER UPDATE ON public.local_resources_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_approved_submission();