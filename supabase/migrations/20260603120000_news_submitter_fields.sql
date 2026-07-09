-- Preserve culture article submitter identity on published news rows.

ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS submitter_email text,
  ADD COLUMN IF NOT EXISTS submitter_name text;

UPDATE public.news n
SET
  submitter_email = COALESCE(n.submitter_email, p.email),
  submitter_name = COALESCE(n.submitter_name, p.full_name)
FROM public.profiles p
WHERE n.created_by = p.id
  AND (n.submitter_email IS NULL OR n.submitter_name IS NULL);

COMMENT ON COLUMN public.news.submitter_email IS
  'Contact email of the person who submitted this culture article.';
COMMENT ON COLUMN public.news.submitter_name IS
  'Display name of the submitter at time of publication.';
