-- Human-readable event URLs: /event/my-event-title (stable slug; duplicates get -2, -3, …)

CREATE OR REPLACE FUNCTION public.events_slugify_title(raw text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT left(
    trim(both '-' FROM lower(regexp_replace(regexp_replace(coalesce(raw, ''), '[^a-zA-Z0-9]+', '-', 'g'), '-+', '-', 'g'))),
    120
  );
$$;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS slug text;

UPDATE public.events e
SET slug = x.computed_slug
FROM (
  WITH numbered AS (
    SELECT
      ev.id,
      COALESCE(NULLIF(public.events_slugify_title(ev.title), ''), 'event') AS base,
      row_number() OVER (
        PARTITION BY COALESCE(NULLIF(public.events_slugify_title(ev.title), ''), 'event')
        ORDER BY coalesce(ev.created_at, now()), ev.id
      ) AS rn
    FROM public.events ev
  )
  SELECT
    numbered.id,
    CASE
      WHEN numbered.rn = 1 THEN numbered.base
      ELSE numbered.base || '-' || numbered.rn::text
    END AS computed_slug
  FROM numbered
) x
WHERE e.id = x.id;

ALTER TABLE public.events ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_unique_idx ON public.events (slug);

CREATE OR REPLACE FUNCTION public.events_assign_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base text;
  cand text;
  n int := 2;
BEGIN
  IF NEW.slug IS NOT NULL AND length(trim(NEW.slug)) > 0 THEN
    RETURN NEW;
  END IF;

  base := COALESCE(NULLIF(public.events_slugify_title(NEW.title), ''), 'event');
  cand := left(base, 120);

  WHILE EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.slug = cand AND e.id IS DISTINCT FROM NEW.id
  ) LOOP
    cand := left(base, 80) || '-' || n::text;
    n := n + 1;
    IF n > 5000 THEN
      cand := 'event-' || replace(gen_random_uuid()::text, '-', '');
      EXIT;
    END IF;
  END LOOP;

  NEW.slug := cand;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_assign_slug_trigger ON public.events;
CREATE TRIGGER events_assign_slug_trigger
BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.events_assign_slug();
