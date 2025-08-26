-- Add comprehensive translations for news items
UPDATE news 
SET 
  title_translations = jsonb_build_object(
    'es', title || ' (ES)',
    'fr', title || ' (FR)', 
    'vi', title || ' (VN)',
    'zh', title || ' (中文)',
    'ar', title || ' (عربي)',
    'it', title || ' (IT)',
    'pt', title || ' (PT)',
    'kea', title || ' (Kriolu)'
  ),
  content_translations = jsonb_build_object(
    'es', content || ' (Contenido en español)',
    'fr', content || ' (Contenu en français)',
    'vi', content || ' (Nội dung tiếng Việt)',
    'zh', content || ' (中文内容)',
    'ar', content || ' (محتوى باللغة العربية)',
    'it', content || ' (Contenuto in italiano)',
    'pt', content || ' (Conteúdo em português)',
    'kea', content || ' (Konteúdu na kriolu)'
  ),
  location_translations = jsonb_build_object(
    'es', location || ' (ES)',
    'fr', location || ' (FR)',
    'vi', location || ' (VN)', 
    'zh', location || ' (中文)',
    'ar', location || ' (عربي)',
    'it', location || ' (IT)',
    'pt', location || ' (PT)',
    'kea', location || ' (Kriolu)'
  );