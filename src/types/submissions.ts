
export interface BusinessSubmission {
  id: string;
  title: string;
  business_type: string;
  address: string;
  neighborhood: string;
  description: string;
  short_description?: string;
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
  date_posted: string;
  source: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}
