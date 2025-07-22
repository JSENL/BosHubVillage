import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

      // Type cast the data to ensure status field is properly typed
      const typedData = (data || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));

      console.log(`Fetched ${typedData.length} business submissions`);
      setSubmissions(typedData);
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