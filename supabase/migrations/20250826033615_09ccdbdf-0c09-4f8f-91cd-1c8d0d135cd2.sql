-- Add JSONB translation columns to core content tables for caching auto-translations

-- Events: translate title, description, location, category
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS title_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS description_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS location_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS category_translations JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Business: translate title, short_description, description, address
ALTER TABLE public.business
  ADD COLUMN IF NOT EXISTS title_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS short_description_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS description_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS address_translations JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Local resources: translate name, description, address
ALTER TABLE public.local_resources
  ADD COLUMN IF NOT EXISTS name_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS description_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS address_translations JSONB NOT NULL DEFAULT '{}'::jsonb;

-- News: translate title, content, location
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS title_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS content_translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS location_translations JSONB NOT NULL DEFAULT '{}'::jsonb;
