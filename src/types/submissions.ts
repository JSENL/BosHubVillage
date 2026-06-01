
export interface BusinessSubmission {
  id: string;
  title: string;
  business_type: string;
  address: string;
  neighborhood: string;
  description: string;
  short_description?: string;
  villages?: string[];
  latitude?: number;
  longitude?: number;
  is_owner?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}


export interface NewsSubmission {
  id: string;
  title: string;
  content: string;
  location: string;
  Address?: string;
  villages?: string[];
  latitude?: number;
  longitude?: number;
  date_posted: string;
  source: string;
  link?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  submitter_email: string;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
