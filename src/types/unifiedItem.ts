export type TranslationsObject = Record<string, string>;

export interface UnifiedItem {
  id: string;
  title: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  type: 'event' | 'news' | 'business' | 'local-service' | 'past-event';
  address?: string;
  location?: string;
  category?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
  neighborhoods?: string;
  villages?: string[] | string;
  business_type?: string;
  name?: string;
  content?: string;
  source?: string;
  originalData?: any;
  image_url?: string | null;
  is_sponsored?: boolean;
  // Translation fields
  title_translations?: TranslationsObject;
  description_translations?: TranslationsObject;
  location_translations?: TranslationsObject;
  address_translations?: TranslationsObject;
  category_translations?: TranslationsObject;
  content_translations?: TranslationsObject;
  name_translations?: TranslationsObject;
  short_description_translations?: TranslationsObject;
}
