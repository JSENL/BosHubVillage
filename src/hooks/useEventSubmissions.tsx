
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEventSubmissionOperations } from './useEventSubmissionOperations';
import { useEventSubmissionCreation } from './useEventSubmissionCreation';

export interface EventSubmission {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  price: number;
  max_attendees: number | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
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

export const useEventSubmissions = () => {
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const submissionOperations = useEventSubmissionOperations();
  const submissionCreation = useEventSubmissionCreation();

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('event_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type cast the data to ensure status field is properly typed
      const typedData = (data || []).map(submission => ({
        ...submission,
        status: submission.status as 'pending' | 'approved' | 'rejected'
      }));

      setSubmissions(typedData);
    } catch (error: any) {
      console.error('Error fetching event submissions:', error);
      toast.error('Failed to load event submissions');
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
    submitEvent: async (...args: Parameters<typeof submissionCreation.submitEvent>) => {
      const result = await submissionCreation.submitEvent(...args);
      handleOperationComplete();
      return result;
    },
    approveSubmission: async (submissionId: string, adminNotes?: string) => {
      await submissionOperations.approveSubmission(submissionId, adminNotes);
      handleOperationComplete();
    },
    rejectSubmission: async (submissionId: string, adminNotes: string) => {
      await submissionOperations.rejectSubmission(submissionId, adminNotes);
      handleOperationComplete();
    },
    updateSubmissionStatus: async (submissionId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
      await submissionOperations.updateSubmissionStatus(submissionId, status, adminNotes);
      handleOperationComplete();
    }
  };
};
