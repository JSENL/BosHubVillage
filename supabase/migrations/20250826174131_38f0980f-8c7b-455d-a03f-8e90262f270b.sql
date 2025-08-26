-- Add sample pre-populated translations for testing Option 2
-- Update events with Spanish and French translations
UPDATE events 
SET 
  title_translations = jsonb_build_object(
    'es', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caribeño de Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Día de Playa de Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam de Poesía de Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Noches de Jazz y Soul de Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Música en la Plaza de Mattapan'
      ELSE title
    END,
    'fr', CASE 
      WHEN title LIKE '%Caribbean%' THEN 'Festival Caribéen de Dorchester'
      WHEN title LIKE '%Beach Day%' THEN 'Journée de Plage de Dorchester'
      WHEN title LIKE '%Poetry%' THEN 'Slam de Poésie de Roxbury'
      WHEN title LIKE '%Jazz%' THEN 'Nuits Jazz et Soul de Roxbury'
      WHEN title LIKE '%Music on%' THEN 'Musique sur la Place de Mattapan'
      ELSE title
    END
  ),
  description_translations = jsonb_build_object(
    'es', CASE 
      WHEN description LIKE '%Caribbean%' THEN 'Celebración de la cultura caribeña con música, baile, comida y vendedores.'
      WHEN description LIKE '%Beach%' THEN 'Actividades de playa, juegos y diversión comunitaria para todas las edades.'
      WHEN description LIKE '%poetry%' THEN 'Slam de poesía hablada con talento local.'
      WHEN description LIKE '%jazz%' THEN 'Una noche de jazz en vivo y música soul con artistas locales.'
      WHEN description LIKE '%music%' THEN 'Noche de música en vivo con bandas locales y vendedores de comida.'
      ELSE description
    END,
    'fr', CASE 
      WHEN description LIKE '%Caribbean%' THEN 'Célébration de la culture caribéenne avec musique, danse, nourriture et vendeurs.'
      WHEN description LIKE '%Beach%' THEN 'Activités de plage, jeux et plaisir communautaire pour tous les âges.'
      WHEN description LIKE '%poetry%' THEN 'Slam de poésie parlée mettant en vedette les talents locaux.'
      WHEN description LIKE '%jazz%' THEN 'Une soirée de jazz et de soul en direct avec des artistes locaux.'
      WHEN description LIKE '%music%' THEN 'Soirée de musique live avec des groupes locaux et des vendeurs de nourriture.'
      ELSE description
    END
  );

-- Add sample translations for business data
UPDATE business 
SET 
  title_translations = jsonb_build_object(
    'es', CASE 
      WHEN title ILIKE '%restaurant%' THEN REPLACE(title, 'Restaurant', 'Restaurante')
      WHEN title ILIKE '%cafe%' THEN REPLACE(title, 'Cafe', 'Café')
      WHEN title ILIKE '%market%' THEN REPLACE(title, 'Market', 'Mercado')
      ELSE title || ' (ES)'
    END,
    'fr', CASE 
      WHEN title ILIKE '%restaurant%' THEN REPLACE(title, 'Restaurant', 'Restaurant')
      WHEN title ILIKE '%cafe%' THEN REPLACE(title, 'Cafe', 'Café')
      WHEN title ILIKE '%market%' THEN REPLACE(title, 'Market', 'Marché')
      ELSE title || ' (FR)'
    END
  ),
  description_translations = jsonb_build_object(
    'es', description || ' (Descripción en español)',
    'fr', description || ' (Description en français)'
  );

-- Add sample translations for local resources
UPDATE local_resources 
SET 
  name_translations = jsonb_build_object(
    'es', name || ' (ES)',
    'fr', name || ' (FR)'
  ),
  description_translations = jsonb_build_object(
    'es', COALESCE(description, '') || ' (Descripción en español)',
    'fr', COALESCE(description, '') || ' (Description en français)'
  );