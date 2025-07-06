
export interface News {
  id: string;
  title: string;
  content: string;
  location: string;
  Address?: string;
  date_posted: string;
  source: string;
  villages?: string[];
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface NewsComment {
  id: string;
  news_id: string;
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
