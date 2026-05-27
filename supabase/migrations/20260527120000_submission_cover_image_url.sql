-- Cover image URL for business and local resource submissions and published rows
ALTER TABLE public.business_submissions ADD COLUMN IF NOT EXISTS image_url text DEFAULT NULL;
ALTER TABLE public.business ADD COLUMN IF NOT EXISTS image_url text DEFAULT NULL;
ALTER TABLE public.local_resources_submissions ADD COLUMN IF NOT EXISTS image_url text DEFAULT NULL;
ALTER TABLE public.local_resources ADD COLUMN IF NOT EXISTS image_url text DEFAULT NULL;
