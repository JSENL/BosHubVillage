
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useAutoTranslate } from './useAutoTranslate';

export const useEventSubmissionOperations = () => {
  const { user } = useAuth();
  const { translateContent } = useAutoTranslate();

  const approveSubmission = async (submissionId: string, adminNotes?: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the submission data
      const { data: submission, error: fetchError } = await supabase
        .from('event_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (fetchError) throw fetchError;

      // Create the event in the events table
      const { data: insertedEvent, error: createError } = await supabase
        .from('events')
        .insert({
          title: submission.title,
          description: submission.description,
          category: submission.category,
          date: submission.date,
          start_time: submission.start_time,
          end_time: submission.end_time,
          location: submission.location,
          price: submission.price,
          max_attendees: submission.max_attendees,
          is_recurring: submission.is_recurring,
          recurring_pattern: submission.recurring_pattern,
          latitude: submission.latitude,
          longitude: submission.longitude,
          created_by: submission.submitted_by,
          image_url: submission.image_url ?? null,
        })
        .select('id')
        .single();

      if (createError) throw createError;

      // Update the submission status
      const { error: updateError } = await supabase
        .from('event_submissions')
        .update({
          status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (updateError) throw updateError;

      toast.success('Event approved and published!');

      // Trigger auto-translation for the new event
      if (insertedEvent?.id) {
        translateContent('events', insertedEvent.id, false);
        // Notify interested users (saved searches, alert preferences, recommendation signals).
        supabase.functions
          .invoke('send-content-alerts', {
            body: { itemType: 'event', itemId: insertedEvent.id },
          })
          .catch((notifyError) => {
            console.error('Event alert dispatch failed:', notifyError);
          });
      }
    } catch (error: any) {
      console.error('Error approving submission:', error);
      toast.error('Failed to approve event');
      throw error;
    }
  };

  const rejectSubmission = async (submissionId: string, adminNotes: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('event_submissions')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success('Event submission rejected');
    } catch (error: any) {
      console.error('Error rejecting submission:', error);
      toast.error('Failed to reject event');
      throw error;
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
    if (status === 'approved') {
      await approveSubmission(submissionId, adminNotes);
    } else {
      await rejectSubmission(submissionId, adminNotes || '');
    }
  };

  return {
    approveSubmission,
    rejectSubmission,
    updateSubmissionStatus
  };
};
