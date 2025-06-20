
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useNewsSubmissionOperations = () => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes: string) => {
    setActionLoading(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (status === 'approved') {
        // Get the submission data
        const { data: submission, error: fetchError } = await supabase
          .from('news_submissions')
          .select('*')
          .eq('id', submissionId)
          .single();

        if (fetchError) throw fetchError;

        // Create the news in the news table
        const { error: createError } = await supabase
          .from('news')
          .insert({
            title: submission.title,
            content: submission.content,
            location: submission.location,
            date_posted: submission.date_posted,
            source: submission.source,
            created_by: submission.submitted_by
          });

        if (createError) throw createError;
      }

      // Update the submission status
      const { error } = await supabase
        .from('news_submissions')
        .update({
          status,
          reviewed_by: user.id,
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
