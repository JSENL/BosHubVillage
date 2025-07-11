import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessSubmissionOperations = () => {
  const [actionLoading, setActionLoading] = useState(false);

  const updateSubmissionStatus = async (
    submissionId: string,
    status: 'approved' | 'rejected',
    adminNotes?: string
  ) => {
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('business_submissions')
        .update({
          status,
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Business submission ${status} successfully`);
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update submission status');
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    updateSubmissionStatus,
    actionLoading,
  };
};