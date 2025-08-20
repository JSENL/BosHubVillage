import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessSubmissionOperations } from './useBusinessSubmissionOperations';

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
  is_owner: boolean | null;
}

export const useBusinessSubmissions = () => {
  const [submissions, setSubmissions] = useState<BusinessSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const submissionOperations = useBusinessSubmissionOperations();

  const fetchSubmissions = async () => {
    try {
      console.log('Fetching business submissions from Supabase...');
      
      const { data, error } = await supabase
        .from('business_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`Fetched ${data?.length || 0} business submissions from Supabase`);
      setSubmissions((data || []) as BusinessSubmission[]);
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
      await submissionOperations.updateSubmissionStatus(submissionId, 'approved', adminNotes);
      handleOperationComplete();
    },
    rejectSubmission: async (submissionId: string, adminNotes: string) => {
      await submissionOperations.updateSubmissionStatus(submissionId, 'rejected', adminNotes);
      handleOperationComplete();
    },
    updateSubmissionStatus: async (submissionId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
      await submissionOperations.updateSubmissionStatus(submissionId, status, adminNotes);
      handleOperationComplete();
    }
  };
};