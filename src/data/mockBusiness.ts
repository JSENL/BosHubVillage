import { Business } from '@/types/business';

export const mockBusinesses: Business[] = [
  {
    id: "ef7c6051-886b-40cf-ba4d-afcf97728fc6",
    title: "Irie Jamaican Style Restaurant",
    business_type: "Restaurant",
    address: "1450 Dorchester Ave, Boston, MA 02122",
    neighborhood: "Dorchester",
    description: "Low-key joint preparing island favorites like jerk chicken, curry goat & beef patties.",
    short_description: "Authentic Jamaican cuisine",
    villages: [],
    latitude: 42.301174,
    longitude: -71.05975,
    created_at: "2025-07-22T01:59:47.83895+00:00",
    updated_at: "2025-07-22T02:11:07.609676+00:00",
    created_by: "da14ad3e-b521-4c09-ae52-46da41b1d1c1"
  },
  {
    id: "42216b3f-0043-45d0-9b6a-cb0fd564ba5a",
    title: "Only One Jamaican Restaurant",
    business_type: "Restaurant", 
    address: "160 Norfolk St, Dorchester Center, MA 02124",
    neighborhood: "Dorchester",
    description: "Laid-back takeout spot with limited seating serving island fare such as jerk chicken & curry goat.",
    short_description: "Jamaican Food is delicious and you'll find its the best here",
    villages: ["Norfolk Triangle"],
    latitude: 42.287165,
    longitude: -71.07862,
    created_at: "2025-07-10T20:21:24.690569+00:00",
    updated_at: "2025-07-11T15:19:29.226581+00:00",
    created_by: "da14ad3e-b521-4c09-ae52-46da41b1d1c1"
  },
  {
    id: "a17c6551-4d91-4356-8692-debe2fd3bae0",
    title: "Pho Hoa Restaurant",
    business_type: "Vietnamese Restaurant",
    address: "1370 Dorchester Ave, Dorchester, MA 02122",
    neighborhood: "Dorchester",
    description: "Popular Vietnamese restaurant known for its authentic pho and traditional Vietnamese dishes.",
    short_description: "Authentic Vietnamese pho spot.",
    villages: ["Fields Corner"],
    latitude: 42.3017,
    longitude: -71.0612,
    created_at: "2025-07-09T16:46:15.627114+00:00",
    updated_at: "2025-07-09T16:46:15.627114+00:00"
  },
  {
    id: "a2d5a487-38a7-41f1-a354-4ac8e8876b34",
    title: "Shanti - Taste of India",
    business_type: "Indian Restaurant",
    address: "1111 Dorchester Ave, Dorchester, MA 02125",
    neighborhood: "Dorchester",
    description: "Authentic Indian cuisine featuring curries, naan, and tandoori specialties in a cozy setting.",
    short_description: "Cozy spot for Indian food.",
    villages: ["Fields Corner"],
    latitude: 42.3141,
    longitude: -71.0576,
    created_at: "2025-07-09T16:46:15.627114+00:00",
    updated_at: "2025-07-09T16:46:15.627114+00:00"
  },
  {
    id: "2ca349e9-f2fd-4069-a774-5588c303c5af",
    title: "Viet's Cafe",
    business_type: "Vietnamese Cafe",
    address: "1415 Dorchester Ave, Dorchester, MA 02122",
    neighborhood: "Dorchester",
    description: "Charming Vietnamese cafe offering fresh sandwiches, coffee, and casual meals.",
    short_description: "Vietnamese cafe with banh mi.",
    villages: ["Fields Corner"],
    latitude: 42.3029,
    longitude: -71.0607,
    created_at: "2025-07-09T16:46:15.627114+00:00",
    updated_at: "2025-07-09T16:46:15.627114+00:00"
  },
  {
    id: "16fc89e0-2e23-4f77-b4ac-bc09acf378eb",
    title: "Ashmont Grill",
    business_type: "American Restaurant",
    address: "555 Talbot Ave, Dorchester, MA 02124",
    neighborhood: "Dorchester",
    description: "Trendy American eatery offering upscale comfort food, cocktails, and a vibrant brunch.",
    short_description: "Trendy spot for comfort food.",
    villages: ["Ashmont"],
    latitude: 42.2843,
    longitude: -71.0634,
    created_at: "2025-07-09T16:46:15.627114+00:00",
    updated_at: "2025-07-09T16:46:15.627114+00:00"
  },
  {
    id: "5f473e6c-59fa-40e5-94e4-32f447c76113",
    title: "Blarney Stone",
    business_type: "Irish Pub",
    address: "1505 Dorchester Ave, Dorchester, MA 02122",
    neighborhood: "Dorchester",
    description: "Lively Irish bar offering classic pub fare, weekend brunch, and a popular outdoor patio.",
    short_description: "Irish bar with patio & brunch.",
    villages: ["Adams Village"],
    latitude: 42.2966,
    longitude: -71.0603,
    created_at: "2025-07-09T16:46:15.627114+00:00",
    updated_at: "2025-07-09T16:46:15.627114+00:00"
  }
];

export const mockBusinessSubmissions = [
  // No pending submissions in mock data - keeping submissions empty for now
];

export const mockBusinessComments = [
  // No business comments in mock data for now
];
