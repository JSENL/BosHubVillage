-- Create a test sponsored business to demonstrate star markers
INSERT INTO public.business (
  title,
  business_type,
  address,
  neighborhood,
  description,
  short_description,
  website_link,
  villages,
  latitude,
  longitude,
  is_sponsored
) VALUES (
  'Star Test Restaurant',
  'Restaurant',
  '123 Main Street, Test City',
  'Downtown',
  'A premium sponsored restaurant featuring the finest cuisine in the area. This business is sponsored and should appear as a star on the map.',
  'Premium sponsored restaurant',
  'https://startestrestaurant.com',
  'Test Village',
  40.7589,
  -73.9851,
  true
);