-- Ensure business_owner rows are removed when a business is deleted
-- 1) Clean up any existing orphaned ownership rows
DELETE FROM public.business_owner bo
WHERE NOT EXISTS (
  SELECT 1 FROM public.business b WHERE b.id = bo.business_id
);

-- 2) Helpful index for joins and cascades
CREATE INDEX IF NOT EXISTS idx_business_owner_business_id ON public.business_owner (business_id);

-- 3) Add FK with ON DELETE CASCADE so deleting a business removes related ownership rows
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'business_owner_business_id_fkey'
  ) THEN
    ALTER TABLE public.business_owner
    ADD CONSTRAINT business_owner_business_id_fkey
    FOREIGN KEY (business_id)
    REFERENCES public.business(id)
    ON DELETE CASCADE;
  END IF;
END $$;