
-- Search for the ID across all main tables with full details
SELECT 
  'business' as table_name, 
  id, 
  title, 
  latitude, 
  longitude, 
  address,
  description,
  created_at 
FROM business 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

UNION ALL

SELECT 
  'business_submissions' as table_name, 
  id, 
  title, 
  latitude, 
  longitude, 
  address,
  description,
  created_at 
FROM business_submissions 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

UNION ALL

SELECT 
  'events' as table_name, 
  id, 
  title, 
  latitude, 
  longitude, 
  address,
  description,
  created_at 
FROM events 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

UNION ALL

SELECT 
  'event_submissions' as table_name, 
  id, 
  title, 
  latitude, 
  longitude, 
  location as address,
  description,
  created_at 
FROM event_submissions 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

UNION ALL

SELECT 
  'news' as table_name, 
  id, 
  title, 
  latitude, 
  longitude, 
  "Address" as address,
  content as description,
  created_at 
FROM news 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

UNION ALL

SELECT 
  'news_submissions' as table_name, 
  id, 
  title, 
  latitude, 
  longitude, 
  "Address" as address,
  content as description,
  created_at 
FROM news_submissions 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

UNION ALL

SELECT 
  'local_resources' as table_name, 
  id, 
  name as title, 
  latitude, 
  longitude, 
  address,
  description,
  created_at 
FROM local_resources 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

UNION ALL

SELECT 
  'local_resources_submissions' as table_name, 
  id, 
  name as title, 
  latitude, 
  longitude, 
  address,
  description,
  created_at 
FROM local_resources_submissions 
WHERE id = '16fc89e0-2e23-4f77-b4ac-bc09acf378eb'

ORDER BY created_at DESC;
