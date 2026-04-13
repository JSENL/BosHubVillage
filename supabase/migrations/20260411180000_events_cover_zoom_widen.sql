-- Allow finer zoom-out / zoom-in for hero framing (see EventHeroImageEditor)
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_cover_zoom_range;

ALTER TABLE public.events
  ADD CONSTRAINT events_cover_zoom_range CHECK (cover_zoom >= 0.25 AND cover_zoom <= 3.0);
