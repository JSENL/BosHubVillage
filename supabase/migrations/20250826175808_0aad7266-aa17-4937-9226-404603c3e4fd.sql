-- Ensure all translation JSON fields exist
UPDATE events SET 
  title_translations = COALESCE(title_translations, '{}'::jsonb),
  description_translations = COALESCE(description_translations, '{}'::jsonb),
  location_translations = COALESCE(location_translations, '{}'::jsonb),
  category_translations = COALESCE(category_translations, '{}'::jsonb);

UPDATE business SET 
  title_translations = COALESCE(title_translations, '{}'::jsonb),
  description_translations = COALESCE(description_translations, '{}'::jsonb),
  address_translations = COALESCE(address_translations, '{}'::jsonb),
  short_description_translations = COALESCE(short_description_translations, '{}'::jsonb);

UPDATE local_resources SET 
  name_translations = COALESCE(name_translations, '{}'::jsonb),
  description_translations = COALESCE(description_translations, '{}'::jsonb),
  address_translations = COALESCE(address_translations, '{}'::jsonb);

UPDATE news SET 
  title_translations = COALESCE(title_translations, '{}'::jsonb),
  content_translations = COALESCE(content_translations, '{}'::jsonb),
  location_translations = COALESCE(location_translations, '{}'::jsonb);

-- Fill missing translations for all selector languages by copying the source field
-- Languages: fr, es, vi, zh, ar, it, pt, kea
-- EVENTS
UPDATE events SET title_translations = jsonb_set(title_translations, '{fr}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'fr','') = '';
UPDATE events SET title_translations = jsonb_set(title_translations, '{es}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'es','') = '';
UPDATE events SET title_translations = jsonb_set(title_translations, '{vi}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'vi','') = '';
UPDATE events SET title_translations = jsonb_set(title_translations, '{zh}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'zh','') = '';
UPDATE events SET title_translations = jsonb_set(title_translations, '{ar}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'ar','') = '';
UPDATE events SET title_translations = jsonb_set(title_translations, '{it}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'it','') = '';
UPDATE events SET title_translations = jsonb_set(title_translations, '{pt}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'pt','') = '';
UPDATE events SET title_translations = jsonb_set(title_translations, '{kea}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'kea','') = '';

UPDATE events SET description_translations = jsonb_set(description_translations, '{fr}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'fr','') = '';
UPDATE events SET description_translations = jsonb_set(description_translations, '{es}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'es','') = '';
UPDATE events SET description_translations = jsonb_set(description_translations, '{vi}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'vi','') = '';
UPDATE events SET description_translations = jsonb_set(description_translations, '{zh}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'zh','') = '';
UPDATE events SET description_translations = jsonb_set(description_translations, '{ar}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'ar','') = '';
UPDATE events SET description_translations = jsonb_set(description_translations, '{it}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'it','') = '';
UPDATE events SET description_translations = jsonb_set(description_translations, '{pt}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'pt','') = '';
UPDATE events SET description_translations = jsonb_set(description_translations, '{kea}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'kea','') = '';

UPDATE events SET location_translations = jsonb_set(location_translations, '{fr}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'fr','') = '';
UPDATE events SET location_translations = jsonb_set(location_translations, '{es}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'es','') = '';
UPDATE events SET location_translations = jsonb_set(location_translations, '{vi}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'vi','') = '';
UPDATE events SET location_translations = jsonb_set(location_translations, '{zh}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'zh','') = '';
UPDATE events SET location_translations = jsonb_set(location_translations, '{ar}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'ar','') = '';
UPDATE events SET location_translations = jsonb_set(location_translations, '{it}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'it','') = '';
UPDATE events SET location_translations = jsonb_set(location_translations, '{pt}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'pt','') = '';
UPDATE events SET location_translations = jsonb_set(location_translations, '{kea}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'kea','') = '';

UPDATE events SET category_translations = jsonb_set(category_translations, '{fr}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'fr','') = '';
UPDATE events SET category_translations = jsonb_set(category_translations, '{es}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'es','') = '';
UPDATE events SET category_translations = jsonb_set(category_translations, '{vi}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'vi','') = '';
UPDATE events SET category_translations = jsonb_set(category_translations, '{zh}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'zh','') = '';
UPDATE events SET category_translations = jsonb_set(category_translations, '{ar}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'ar','') = '';
UPDATE events SET category_translations = jsonb_set(category_translations, '{it}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'it','') = '';
UPDATE events SET category_translations = jsonb_set(category_translations, '{pt}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'pt','') = '';
UPDATE events SET category_translations = jsonb_set(category_translations, '{kea}', to_jsonb(category), true) WHERE COALESCE(category_translations->>'kea','') = '';

-- BUSINESS
UPDATE business SET title_translations = jsonb_set(title_translations, '{fr}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'fr','') = '';
UPDATE business SET title_translations = jsonb_set(title_translations, '{es}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'es','') = '';
UPDATE business SET title_translations = jsonb_set(title_translations, '{vi}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'vi','') = '';
UPDATE business SET title_translations = jsonb_set(title_translations, '{zh}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'zh','') = '';
UPDATE business SET title_translations = jsonb_set(title_translations, '{ar}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'ar','') = '';
UPDATE business SET title_translations = jsonb_set(title_translations, '{it}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'it','') = '';
UPDATE business SET title_translations = jsonb_set(title_translations, '{pt}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'pt','') = '';
UPDATE business SET title_translations = jsonb_set(title_translations, '{kea}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'kea','') = '';

UPDATE business SET description_translations = jsonb_set(description_translations, '{fr}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'fr','') = '';
UPDATE business SET description_translations = jsonb_set(description_translations, '{es}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'es','') = '';
UPDATE business SET description_translations = jsonb_set(description_translations, '{vi}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'vi','') = '';
UPDATE business SET description_translations = jsonb_set(description_translations, '{zh}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'zh','') = '';
UPDATE business SET description_translations = jsonb_set(description_translations, '{ar}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'ar','') = '';
UPDATE business SET description_translations = jsonb_set(description_translations, '{it}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'it','') = '';
UPDATE business SET description_translations = jsonb_set(description_translations, '{pt}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'pt','') = '';
UPDATE business SET description_translations = jsonb_set(description_translations, '{kea}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'kea','') = '';

UPDATE business SET address_translations = jsonb_set(address_translations, '{fr}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'fr','') = '';
UPDATE business SET address_translations = jsonb_set(address_translations, '{es}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'es','') = '';
UPDATE business SET address_translations = jsonb_set(address_translations, '{vi}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'vi','') = '';
UPDATE business SET address_translations = jsonb_set(address_translations, '{zh}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'zh','') = '';
UPDATE business SET address_translations = jsonb_set(address_translations, '{ar}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'ar','') = '';
UPDATE business SET address_translations = jsonb_set(address_translations, '{it}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'it','') = '';
UPDATE business SET address_translations = jsonb_set(address_translations, '{pt}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'pt','') = '';
UPDATE business SET address_translations = jsonb_set(address_translations, '{kea}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'kea','') = '';

UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{fr}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'fr','') = '';
UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{es}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'es','') = '';
UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{vi}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'vi','') = '';
UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{zh}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'zh','') = '';
UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{ar}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'ar','') = '';
UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{it}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'it','') = '';
UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{pt}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'pt','') = '';
UPDATE business SET short_description_translations = jsonb_set(short_description_translations, '{kea}', to_jsonb(COALESCE(short_description,'')), true) WHERE COALESCE(short_description_translations->>'kea','') = '';

-- LOCAL RESOURCES
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{fr}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'fr','') = '';
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{es}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'es','') = '';
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{vi}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'vi','') = '';
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{zh}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'zh','') = '';
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{ar}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'ar','') = '';
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{it}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'it','') = '';
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{pt}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'pt','') = '';
UPDATE local_resources SET name_translations = jsonb_set(name_translations, '{kea}', to_jsonb(name), true) WHERE COALESCE(name_translations->>'kea','') = '';

UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{fr}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'fr','') = '';
UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{es}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'es','') = '';
UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{vi}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'vi','') = '';
UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{zh}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'zh','') = '';
UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{ar}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'ar','') = '';
UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{it}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'it','') = '';
UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{pt}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'pt','') = '';
UPDATE local_resources SET description_translations = jsonb_set(description_translations, '{kea}', to_jsonb(COALESCE(description,'')), true) WHERE COALESCE(description_translations->>'kea','') = '';

UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{fr}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'fr','') = '';
UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{es}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'es','') = '';
UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{vi}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'vi','') = '';
UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{zh}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'zh','') = '';
UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{ar}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'ar','') = '';
UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{it}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'it','') = '';
UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{pt}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'pt','') = '';
UPDATE local_resources SET address_translations = jsonb_set(address_translations, '{kea}', to_jsonb(address), true) WHERE COALESCE(address_translations->>'kea','') = '';

-- NEWS
UPDATE news SET title_translations = jsonb_set(title_translations, '{fr}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'fr','') = '';
UPDATE news SET title_translations = jsonb_set(title_translations, '{es}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'es','') = '';
UPDATE news SET title_translations = jsonb_set(title_translations, '{vi}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'vi','') = '';
UPDATE news SET title_translations = jsonb_set(title_translations, '{zh}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'zh','') = '';
UPDATE news SET title_translations = jsonb_set(title_translations, '{ar}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'ar','') = '';
UPDATE news SET title_translations = jsonb_set(title_translations, '{it}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'it','') = '';
UPDATE news SET title_translations = jsonb_set(title_translations, '{pt}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'pt','') = '';
UPDATE news SET title_translations = jsonb_set(title_translations, '{kea}', to_jsonb(title), true) WHERE COALESCE(title_translations->>'kea','') = '';

UPDATE news SET content_translations = jsonb_set(content_translations, '{fr}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'fr','') = '';
UPDATE news SET content_translations = jsonb_set(content_translations, '{es}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'es','') = '';
UPDATE news SET content_translations = jsonb_set(content_translations, '{vi}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'vi','') = '';
UPDATE news SET content_translations = jsonb_set(content_translations, '{zh}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'zh','') = '';
UPDATE news SET content_translations = jsonb_set(content_translations, '{ar}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'ar','') = '';
UPDATE news SET content_translations = jsonb_set(content_translations, '{it}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'it','') = '';
UPDATE news SET content_translations = jsonb_set(content_translations, '{pt}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'pt','') = '';
UPDATE news SET content_translations = jsonb_set(content_translations, '{kea}', to_jsonb(content), true) WHERE COALESCE(content_translations->>'kea','') = '';

UPDATE news SET location_translations = jsonb_set(location_translations, '{fr}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'fr','') = '';
UPDATE news SET location_translations = jsonb_set(location_translations, '{es}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'es','') = '';
UPDATE news SET location_translations = jsonb_set(location_translations, '{vi}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'vi','') = '';
UPDATE news SET location_translations = jsonb_set(location_translations, '{zh}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'zh','') = '';
UPDATE news SET location_translations = jsonb_set(location_translations, '{ar}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'ar','') = '';
UPDATE news SET location_translations = jsonb_set(location_translations, '{it}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'it','') = '';
UPDATE news SET location_translations = jsonb_set(location_translations, '{pt}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'pt','') = '';
UPDATE news SET location_translations = jsonb_set(location_translations, '{kea}', to_jsonb(location), true) WHERE COALESCE(location_translations->>'kea','') = '';
