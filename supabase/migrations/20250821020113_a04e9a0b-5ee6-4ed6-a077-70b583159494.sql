-- Ensure business_owner is auto-populated when a business is created or when created_by changes
DO $$
BEGIN
  -- After INSERT trigger
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_business_after_insert_owner'
  ) THEN
    CREATE TRIGGER trg_business_after_insert_owner
    AFTER INSERT ON public.business
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_business_owner_on_business_insert();
  END IF;

  -- After UPDATE trigger for created_by changes
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_business_after_update_owner'
  ) THEN
    CREATE TRIGGER trg_business_after_update_owner
    AFTER UPDATE OF created_by ON public.business
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_business_owner_on_business_update();
  END IF;
END $$;