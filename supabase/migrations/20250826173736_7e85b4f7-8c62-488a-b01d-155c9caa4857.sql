-- Clear all translation fields from business and local_resources tables
UPDATE business 
SET 
  title_translations = '{}'::jsonb,
  description_translations = '{}'::jsonb,
  address_translations = '{}'::jsonb,
  short_description_translations = '{}'::jsonb;

UPDATE local_resources 
SET 
  name_translations = '{}'::jsonb,
  description_translations = '{}'::jsonb,
  address_translations = '{}'::jsonb;