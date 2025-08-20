-- 1) Ensure unique mapping between business and owner
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_owner_unique ON public.business_owner (business_id, owner_id);

-- 2) Backfill ownerships for existing businesses using created_by
INSERT INTO public.business_owner (business_id, owner_id)
SELECT b.id, b.created_by
FROM public.business b
WHERE b.created_by IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM public.business_owner bo
  WHERE bo.business_id = b.id AND bo.owner_id = b.created_by
);

-- 3) Create trigger to automatically add ownership on business insert
CREATE OR REPLACE FUNCTION public.handle_business_owner_on_business_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO public.business_owner (business_id, owner_id)
    SELECT NEW.id, NEW.created_by
    WHERE NOT EXISTS (
      SELECT 1 FROM public.business_owner bo
      WHERE bo.business_id = NEW.id AND bo.owner_id = NEW.created_by
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS business_owner_on_business_insert ON public.business;
CREATE TRIGGER business_owner_on_business_insert
AFTER INSERT ON public.business
FOR EACH ROW
EXECUTE FUNCTION public.handle_business_owner_on_business_insert();

-- 4) Create trigger to handle updates to created_by (safety for manual fixes)
CREATE OR REPLACE FUNCTION public.handle_business_owner_on_business_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.created_by IS NOT NULL AND (OLD.created_by IS DISTINCT FROM NEW.created_by) THEN
    INSERT INTO public.business_owner (business_id, owner_id)
    SELECT NEW.id, NEW.created_by
    WHERE NOT EXISTS (
      SELECT 1 FROM public.business_owner bo
      WHERE bo.business_id = NEW.id AND bo.owner_id = NEW.created_by
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS business_owner_on_business_update ON public.business;
CREATE TRIGGER business_owner_on_business_update
AFTER UPDATE OF created_by ON public.business
FOR EACH ROW
EXECUTE FUNCTION public.handle_business_owner_on_business_update();