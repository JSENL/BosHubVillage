-- Add proper translations for the Roxbury Block Party description in Portuguese, Italian, and Arabic
UPDATE events 
SET description_translations = jsonb_set(
  jsonb_set(
    jsonb_set(
      description_translations, 
      '{pt}', 
      '"Festa de quarteirão com música ao vivo, food trucks e atividades para crianças."'::jsonb
    ),
    '{it}', 
    '"Festa di quartiere con musica dal vivo, food truck e attività per bambini."'::jsonb
  ),
  '{ar}', 
  '"حفلة في الحي مع موسيقى حية وشاحنات طعام وأنشطة للأطفال."'::jsonb
)
WHERE id = 'b6d9b501-e40c-4a29-b527-dfb4d04a0e4f';

-- Also add title translations to complete the set
UPDATE events 
SET title_translations = jsonb_set(
  jsonb_set(
    jsonb_set(
      title_translations, 
      '{pt}', 
      '"Festa de Quarteirão de Roxbury"'::jsonb
    ),
    '{it}', 
    '"Festa di Quartiere di Roxbury"'::jsonb
  ),
  '{ar}', 
  '"حفلة حي روكسبري"'::jsonb
)
WHERE id = 'b6d9b501-e40c-4a29-b527-dfb4d04a0e4f';