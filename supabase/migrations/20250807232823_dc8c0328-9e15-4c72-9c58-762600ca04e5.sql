-- Fix incorrectly geocoded local resources by clearing coordinates for resources outside Boston area
-- This will allow them to be re-geocoded correctly on the next import or manually

UPDATE local_resources 
SET latitude = NULL, longitude = NULL 
WHERE 
  -- Clear coordinates that are clearly not in Boston area
  (latitude < 40 OR latitude > 45)  -- Outside reasonable Boston latitude range
  OR (longitude < -75 OR longitude > -65)  -- Outside reasonable Boston longitude range
  OR (latitude BETWEEN -90 AND 0 AND longitude BETWEEN 100 AND 180)  -- Southern hemisphere coordinates
  OR (latitude BETWEEN -90 AND 0 AND longitude BETWEEN -180 AND -100); -- Other misplaced coordinates

-- Log which records were updated
SELECT 
  name, 
  address, 
  neighborhood,
  CASE 
    WHEN latitude IS NULL THEN 'Coordinates cleared for re-geocoding'
    ELSE 'Coordinates preserved'
  END as status
FROM local_resources 
ORDER BY name;