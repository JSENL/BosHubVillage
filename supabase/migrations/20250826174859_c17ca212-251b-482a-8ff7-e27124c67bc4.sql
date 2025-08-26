-- Add comprehensive translations for business and local_resources
UPDATE business 
SET 
  title_translations = jsonb_build_object(
    'es', CASE 
      WHEN title ILIKE '%restaurant%' THEN REPLACE(title, 'Restaurant', 'Restaurante')
      WHEN title ILIKE '%cafe%' THEN REPLACE(title, 'Cafe', 'Café')
      WHEN title ILIKE '%market%' THEN REPLACE(title, 'Market', 'Mercado')
      ELSE title
    END,
    'fr', CASE 
      WHEN title ILIKE '%restaurant%' THEN REPLACE(title, 'Restaurant', 'Restaurant')
      WHEN title ILIKE '%cafe%' THEN REPLACE(title, 'Cafe', 'Café')
      WHEN title ILIKE '%market%' THEN REPLACE(title, 'Market', 'Marché')
      ELSE title
    END,
    'vi', title || ' (VN)',
    'zh', title || ' (中文)',
    'ar', title || ' (عربي)',
    'it', title || ' (IT)',
    'pt', title || ' (PT)',
    'kea', title || ' (Kriolu)'
  ),
  description_translations = jsonb_build_object(
    'es', CASE 
      WHEN description ILIKE '%vietnamese%' THEN 'Restaurante vietnamita popular conocido por su auténtico pho y platos tradicionales vietnamitas.'
      WHEN description ILIKE '%jamaican%' THEN 'Auténtica cocina jamaicana con pollo jerk, cabra al curry y favoritos tradicionales de la isla.'
      WHEN description ILIKE '%takeout%' THEN 'Lugar relajado de comida para llevar con asientos limitados.'
      ELSE description || ' (ES)'
    END,
    'fr', CASE 
      WHEN description ILIKE '%vietnamese%' THEN 'Restaurant vietnamien populaire connu pour son pho authentique et ses plats traditionnels vietnamiens.'
      WHEN description ILIKE '%jamaican%' THEN 'Cuisine jamaïcaine authentique avec poulet jerk, chèvre au curry et favoris traditionnels de l''île.'
      WHEN description ILIKE '%takeout%' THEN 'Endroit décontracté de plats à emporter avec des sièges limités.'
      ELSE description || ' (FR)'
    END,
    'vi', description || ' (VN)',
    'zh', description || ' (中文)',
    'ar', description || ' (عربي)',
    'it', description || ' (IT)', 
    'pt', description || ' (PT)',
    'kea', description || ' (Kriolu)'
  );

UPDATE local_resources 
SET 
  name_translations = jsonb_build_object(
    'es', CASE 
      WHEN name ILIKE '%center%' THEN REPLACE(name, 'Center', 'Centro')
      WHEN name ILIKE '%house%' THEN REPLACE(name, 'House', 'Casa')
      WHEN name ILIKE '%institute%' THEN REPLACE(name, 'Institute', 'Instituto')
      ELSE name
    END,
    'fr', CASE 
      WHEN name ILIKE '%center%' THEN REPLACE(name, 'Center', 'Centre')
      WHEN name ILIKE '%house%' THEN REPLACE(name, 'House', 'Maison')
      WHEN name ILIKE '%institute%' THEN REPLACE(name, 'Institute', 'Institut')
      ELSE name
    END,
    'vi', name || ' (VN)',
    'zh', name || ' (中文)',
    'ar', name || ' (عربي)',
    'it', name || ' (IT)',
    'pt', name || ' (PT)',
    'kea', name || ' (Kriolu)'
  ),
  description_translations = jsonb_build_object(
    'es', CASE 
      WHEN description ILIKE '%community%' THEN 'Organización comunitaria que ofrece vivienda, programas de alimentos y una cafetería de empresa social.'
      WHEN description ILIKE '%wildlife%' THEN 'Santuario de vida silvestre que ofrece programas ambientales y senderos para caminar.'
      WHEN description ILIKE '%farming%' THEN 'Promueve la agricultura urbana, el acceso a alimentos y talleres comunitarios.'
      ELSE COALESCE(description, '') || ' (ES)'
    END,
    'fr', CASE 
      WHEN description ILIKE '%community%' THEN 'Organisation communautaire offrant logement, programmes alimentaires et café d''entreprise sociale.'
      WHEN description ILIKE '%wildlife%' THEN 'Sanctuaire faunique offrant des programmes environnementaux et des sentiers de randonnée.'
      WHEN description ILIKE '%farming%' THEN 'Promeut l''agriculture urbaine, l''accès alimentaire et les ateliers communautaires.'
      ELSE COALESCE(description, '') || ' (FR)'
    END,
    'vi', COALESCE(description, '') || ' (VN)',
    'zh', COALESCE(description, '') || ' (中文)',
    'ar', COALESCE(description, '') || ' (عربي)',
    'it', COALESCE(description, '') || ' (IT)',
    'pt', COALESCE(description, '') || ' (PT)',
    'kea', COALESCE(description, '') || ' (Kriolu)'
  );