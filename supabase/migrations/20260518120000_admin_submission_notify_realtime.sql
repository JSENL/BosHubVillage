-- Realtime for admin pending-count badges + DB trigger to email admins on new submissions.
-- After applying: set webhook secret via migration 20260518130000 (private config table).
-- Edge secrets: ADMIN_SUBMISSION_WEBHOOK_SECRET, RESEND_API_KEY, PUBLIC_SITE_URL (optional)

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Add submission tables to Realtime publication (idempotent)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.event_submissions;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.news_submissions;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.business_submissions;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.local_resources_submissions;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.notify_admin_on_pending_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  webhook_secret text;
  project_url text;
  function_url text;
  payload jsonb;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM 'pending' THEN
    RETURN NEW;
  END IF;

  webhook_secret := current_setting('app.admin_submission_webhook_secret', true);
  project_url := nullif(current_setting('app.supabase_project_url', true), '');

  IF project_url IS NULL THEN
    project_url := 'https://mecotkulcgdbilaksddu.supabase.co';
  END IF;

  IF webhook_secret IS NULL OR length(webhook_secret) = 0 THEN
    RAISE WARNING 'Admin submission email skipped: app.admin_submission_webhook_secret is not set';
    RETURN NEW;
  END IF;

  function_url := rtrim(project_url, '/') || '/functions/v1/notify-admin-submission';

  payload := jsonb_build_object(
    'submissionType', TG_ARGV[0],
    'triggerOp', TG_OP,
    'record', to_jsonb(NEW)
  );

  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', webhook_secret
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'notify_admin_on_pending_submission failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_admin_event_submission_insert ON public.event_submissions;
CREATE TRIGGER notify_admin_event_submission_insert
  AFTER INSERT ON public.event_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_pending_submission('event');

DROP TRIGGER IF EXISTS notify_admin_news_submission_insert ON public.news_submissions;
CREATE TRIGGER notify_admin_news_submission_insert
  AFTER INSERT ON public.news_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_pending_submission('news');

DROP TRIGGER IF EXISTS notify_admin_business_submission_insert ON public.business_submissions;
CREATE TRIGGER notify_admin_business_submission_insert
  AFTER INSERT ON public.business_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_pending_submission('business');

DROP TRIGGER IF EXISTS notify_admin_local_resource_submission_insert ON public.local_resources_submissions;
CREATE TRIGGER notify_admin_local_resource_submission_insert
  AFTER INSERT ON public.local_resources_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_pending_submission('local_resource');
