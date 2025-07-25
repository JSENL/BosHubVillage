-- Manually move the existing approved business submission to main business table
INSERT INTO public.business (
  title,
  business_type,
  address,
  neighborhood,
  description,
  short_description,
  villages,
  latitude,
  longitude,
  created_by,
  created_at,
  updated_at
)
SELECT 
  title,
  business_type,
  address,
  neighborhood,
  description,
  short_description,
  NULL as villages,
  latitude,
  longitude,
  submitted_by as created_by,
  created_at,
  updated_at
FROM public.business_submissions 
WHERE status = 'approved';

-- Delete the moved submissions
DELETE FROM public.business_submissions WHERE status = 'approved';