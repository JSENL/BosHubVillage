-- Add 'proprietor' to the app_role enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role'
      AND n.nspname = 'public'
      AND e.enumlabel = 'proprietor'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'proprietor';
  END IF;
END $$;