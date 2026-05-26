-- Approved submissions are published once from application code (insert + side effects).
-- Triggers must only remove the submission row when status becomes approved, not insert duplicates.

CREATE OR REPLACE FUNCTION public.handle_approved_event_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    DELETE FROM public.event_submissions WHERE id = NEW.id;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_approved_local_resources_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    DELETE FROM public.local_resources_submissions WHERE id = NEW.id;
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$function$;

-- Redundant with BEFORE handlers above; avoid double-delete attempts.
DROP TRIGGER IF EXISTS delete_approved_event_submission ON public.event_submissions;
DROP TRIGGER IF EXISTS delete_approved_local_resources_submission ON public.local_resources_submissions;

-- Legacy business trigger inserted into business on approve; app publishes once.
DROP TRIGGER IF EXISTS move_approved_business_submission_trigger ON public.business_submissions;
DROP FUNCTION IF EXISTS public.move_approved_business_submission();
