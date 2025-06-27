
export interface UnifiedItem {
  id: string;
  title: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  type: 'event' | 'news' | 'business' | 'local-service';
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
}
