-- Fix incorrectly mapped local resources data
-- Clear problematic records that have wrong field mappings so they can be re-imported correctly

-- Update records where description contains just a neighborhood name (indicating wrong mapping)
UPDATE local_resources 
SET 
  description = CASE 
    WHEN description IN ('Roxbury', 'Hyde Park', 'Dorchester', 'Mattapan', 'South End') 
    THEN NULL
    ELSE description 
  END,
  village = CASE 
    WHEN village LIKE 'MA %' OR village LIKE '%02%' 
    THEN NULL 
    ELSE village 
  END,
  website_link = CASE 
    WHEN website_link ~ '^[0-9.-]+$' OR website_link IN ('food programs', 'adults', 'and seniors')
    THEN NULL
    ELSE website_link
  END
WHERE 
  -- Target records that likely have wrong field mappings
  description IN ('Roxbury', 'Hyde Park', 'Dorchester', 'Mattapan', 'South End')
  OR village LIKE 'MA %' 
  OR village LIKE '%02%'
  OR website_link ~ '^[0-9.-]+$'
  OR website_link IN ('food programs', 'adults', 'and seniors');

-- Show the updated records for verification
SELECT name, category, address, neighborhood, village, description, website_link 
FROM local_resources 
ORDER BY name;