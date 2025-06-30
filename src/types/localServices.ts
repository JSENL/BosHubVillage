
export interface LocalResource {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  village?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
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
