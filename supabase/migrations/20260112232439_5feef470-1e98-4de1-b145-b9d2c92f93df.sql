-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- Create a cron job that runs daily at 8:00 AM UTC
-- The weekly-digest function will check if today matches each user's preferred day
SELECT cron.schedule(
  'daily-weekly-digest-trigger',
  '0 8 * * *', -- Every day at 8:00 AM UTC
  $$
  SELECT net.http_post(
    url := 'https://mecotkulcgdbilaksddu.supabase.co/functions/v1/weekly-digest',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY290a3VsY2dkYmlsYWtzZGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NDE3MzAsImV4cCI6MjA2NDExNzczMH0.GO1Q8_3qngQHqiNE__pdXu57qBMDzOmYNjrpsIgNBY8'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);