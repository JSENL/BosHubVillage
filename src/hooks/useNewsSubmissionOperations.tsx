
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NewsSubmission } from '@/types/submissions';

export const useNewsSubmissionOperations = () => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes: string) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('news_submissions')
        .update({
          status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`News ${status} successfully!`);
    } catch (error: any) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} news:`, error);
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} news`);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    updateSubmissionStatus,
    actionLoading
  };
};
