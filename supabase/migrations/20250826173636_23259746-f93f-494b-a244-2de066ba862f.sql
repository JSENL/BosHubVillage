-- Clear all translation fields from events table
UPDATE events 
SET 
  title_translations = '{}'::jsonb,
  description_translations = '{}'::jsonb,
  location_translations = '{}'::jsonb,
  category_translations = '{}'::jsonb;