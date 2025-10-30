import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const submissionOperations = useBusinessSubmissionOperations();

  const { data: submissions = [], isLoading: loading, refetch: fetchSubmissions } = useQuery({
    queryKey: ['business-submissions'],
    queryFn: async () => {
      console.log('Fetching business submissions from Supabase...');
      
      const { data, error } = await supabase
        .from('business_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`Fetched ${data?.length || 0} business submissions from Supabase`);
      return (data || []) as BusinessSubmission[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleOperationComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['business-submissions'] });
  };

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