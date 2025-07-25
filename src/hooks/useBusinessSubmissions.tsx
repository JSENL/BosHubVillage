import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { mockBusinessSubmissions } from '@/data/mockBusiness';

export interface BusinessSubmission {
  id: string;
  title: string;
  business_type: string;
  address: string;
  neighborhood: string;
  description: string;
  short_description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
}

export const useBusinessSubmissions = () => {
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching business submissions from mock data...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log(`Fetched ${mockBusinessSubmissions.length} business submissions from mock data`);
      setSubmissions(mockBusinessSubmissions);
    } catch (error: any) {
      console.error('Error fetching business submissions:', error);
      toast.error('Failed to load business submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleOperationComplete = () => {
    fetchSubmissions();
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    submissions,
    loading,
    fetchSubmissions,
    approveSubmission: async (submissionId: string, adminNotes?: string) => {
      console.log(`Mock: Approving business submission ${submissionId} with notes: ${adminNotes}`);
      toast.success('Business submission approved successfully');
      handleOperationComplete();
    },
    rejectSubmission: async (submissionId: string, adminNotes: string) => {
      console.log(`Mock: Rejecting business submission ${submissionId} with notes: ${adminNotes}`);
      toast.success('Business submission rejected successfully');
      handleOperationComplete();
    },
    updateSubmissionStatus: async (submissionId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
      console.log(`Mock: Updating business submission ${submissionId} status to ${status} with notes: ${adminNotes}`);
      toast.success(`Business submission ${status} successfully`);
      handleOperationComplete();
    }
  };
};