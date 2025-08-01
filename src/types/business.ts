export interface Business {
  id: string;
  title: string;
  business_type: string;
  address: string;
  neighborhood: string;
  description: string;
  short_description?: string;
  website_link?: string;
  villages?: string[] | string | null;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface BusinessComment {
  id: string;
  business_id: string;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
  parent_comment_id?: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}