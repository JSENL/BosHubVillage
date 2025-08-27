-- Update the Roxbury Block Party event to clear placeholder translations for Portuguese, Italian, and Arabic
-- This will allow the auto-translate system to regenerate proper translations

UPDATE events 
SET 
  title_translations = jsonb_set(
    jsonb_set(
      jsonb_set(title_translations, '{pt}', 'null'::jsonb),
      '{it}', 'null'::jsonb
    ),
    '{ar}', 'null'::jsonb
  ),
  description_translations = jsonb_set(
    jsonb_set(
      jsonb_set(description_translations, '{pt}', 'null'::jsonb),
      '{it}', 'null'::jsonb
    ),
    '{ar}', 'null'::jsonb
  )
WHERE id = 'b6d9b501-e40c-4a29-b527-dfb4d04a0e4f';