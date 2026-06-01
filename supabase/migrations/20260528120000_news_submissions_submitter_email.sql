-- Store submitter contact email on culture (news) submissions for admin review.

ALTER TABLE public.news_submissions
  ADD COLUMN IF NOT EXISTS submitter_email text;

UPDATE public.news_submissions ns
SET submitter_email = COALESCE(
  p.email,
  'legacy-submission@hubvillage.app'
)
FROM public.profiles p
WHERE ns.submitted_by = p.id
  AND ns.submitter_email IS NULL;

UPDATE public.news_submissions
SET submitter_email = 'legacy-submission@hubvillage.app'
WHERE submitter_email IS NULL;

ALTER TABLE public.news_submissions
  ALTER COLUMN submitter_email SET NOT NULL;

COMMENT ON COLUMN public.news_submissions.submitter_email IS
  'Contact email provided by the submitter when posting a culture article.';
