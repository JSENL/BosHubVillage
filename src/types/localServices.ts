export type TranslationsObject = Record<string, string>;

export interface LocalResource {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  village?: string;
  description?: string;
  website_link?: string;
  latitude?: number;
  longitude?: number;
  permanently_closed?: boolean;
  created_at: string;
  updated_at: string;
  is_sponsored?: boolean;
  name_translations?: TranslationsObject;
  description_translations?: TranslationsObject;
  address_translations?: TranslationsObject;
  category_translations?: TranslationsObject;
}

export interface LocalResourceSubmission {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  village?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
