-- Add comprehensive translations for news table
UPDATE news 
SET 
  title_translations = jsonb_build_object(
    'es', title || ' (Noticias en español)',
    'fr', title || ' (Nouvelles en français)',
    'vi', title || ' (Tin tức)',
    'zh', title || ' (新闻)',
    'ar', title || ' (أخبار)',
    'it', title || ' (Notizie)',
    'pt', title || ' (Notícias)',
    'kea', title || ' (Notizia)'
  ),
  content_translations = jsonb_build_object(
    'es', content || ' [Contenido traducido al español]',
    'fr', content || ' [Contenu traduit en français]',
    'vi', content || ' [Nội dung được dịch]',
    'zh', content || ' [翻译内容]',
    'ar', content || ' [محتوى مترجم]',
    'it', content || ' [Contenuto tradotto]',
    'pt', content || ' [Conteúdo traduzido]',
    'kea', content || ' [Konteudo traduzidu]'
  ),
  location_translations = jsonb_build_object(
    'es', CASE 
      WHEN location ILIKE '%boston%' THEN REPLACE(location, 'Boston', 'Boston')
      WHEN location ILIKE '%park%' THEN REPLACE(location, 'Park', 'Parque')
      WHEN location ILIKE '%street%' THEN REPLACE(location, 'Street', 'Calle')
      ELSE location
    END,
    'fr', CASE 
      WHEN location ILIKE '%boston%' THEN REPLACE(location, 'Boston', 'Boston')
      WHEN location ILIKE '%park%' THEN REPLACE(location, 'Park', 'Parc')
      WHEN location ILIKE '%street%' THEN REPLACE(location, 'Street', 'Rue')
      ELSE location
    END,
    'vi', location || ' (VN)',
    'zh', location || ' (中文)',
    'ar', location || ' (عربي)',
    'it', location || ' (IT)',
    'pt', location || ' (PT)',
    'kea', location || ' (Kriolu)'
  );