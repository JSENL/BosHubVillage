-- Event submission media files (mirrors news_submission_media pattern).

CREATE TABLE public.event_submissions_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_submission_id UUID NOT NULL REFERENCES public.event_submissions(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX event_submissions_media_submission_id_idx
  ON public.event_submissions_media (event_submission_id);

ALTER TABLE public.event_submissions_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event submission media records"
ON public.event_submissions_media FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert event submission media records"
ON public.event_submissions_media FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own event submission media records"
ON public.event_submissions_media FOR DELETE
USING (
  event_submission_id IN (
    SELECT id FROM public.event_submissions
    WHERE submitted_by = auth.uid()
  )
);

CREATE POLICY "Admins can delete any event submission media records"
ON public.event_submissions_media FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
