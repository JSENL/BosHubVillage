-- Framing for event cover hero (zoom + focal point); defaults keep current full-bleed look
ALTER TABLE public.events
  ADD COLUMN cover_zoom real NOT NULL DEFAULT 1,
  ADD COLUMN cover_focus_x real NOT NULL DEFAULT 50,
  ADD COLUMN cover_focus_y real NOT NULL DEFAULT 50;

ALTER TABLE public.events
  ADD CONSTRAINT events_cover_zoom_range CHECK (cover_zoom >= 0.5 AND cover_zoom <= 2.0);

ALTER TABLE public.events
  ADD CONSTRAINT events_cover_focus_x_range CHECK (cover_focus_x >= 0 AND cover_focus_x <= 100);

ALTER TABLE public.events
  ADD CONSTRAINT events_cover_focus_y_range CHECK (cover_focus_y >= 0 AND cover_focus_y <= 100);
