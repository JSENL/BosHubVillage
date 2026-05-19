-- Supabase SQL editor cannot run ALTER DATABASE ... SET for custom GUCs (42501).
-- Store the webhook secret in a private config table instead.

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE IF NOT EXISTS private.admin_submission_webhook_config (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  webhook_secret text NOT NULL,
  project_url text NOT NULL DEFAULT 'https://mecotkulcgdbilaksddu.supabase.co',
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE private.admin_submission_webhook_config IS
  'Webhook secret for notify-admin-submission edge function. Must match ADMIN_SUBMISSION_WEBHOOK_SECRET.';

-- Not exposed via PostgREST API
REVOKE ALL ON SCHEMA private FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO postgres, service_role;
GRANT SELECT ON private.admin_submission_webhook_config TO postgres, service_role;

ALTER TABLE private.admin_submission_webhook_config ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.notify_admin_on_pending_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private, extensions
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

  SELECT c.webhook_secret, c.project_url
  INTO webhook_secret, project_url
  FROM private.admin_submission_webhook_config c
  WHERE c.id = 1;

  IF webhook_secret IS NULL OR length(webhook_secret) = 0 THEN
    RAISE WARNING 'Admin submission email skipped: private.admin_submission_webhook_config row missing';
    RETURN NEW;
  END IF;

  IF project_url IS NULL OR length(project_url) = 0 THEN
    project_url := 'https://mecotkulcgdbilaksddu.supabase.co';
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

-- Run once in SQL editor (replace YOUR_SECRET with the same value as edge secret):
-- INSERT INTO private.admin_submission_webhook_config (id, webhook_secret)
-- VALUES (1, 'YOUR_SECRET')
-- ON CONFLICT (id) DO UPDATE
--   SET webhook_secret = EXCLUDED.webhook_secret,
--       updated_at = now();
