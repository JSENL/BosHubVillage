import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAutoTranslate } from './useAutoTranslate';

export const useNewsSubmissionOperations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const { translateContent } = useAutoTranslate();

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes: string) => {
    setActionLoading(true);
    let newNewsId: string | null = null;
    
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

        console.log('Approving news submission:', submission);

        // Get the first media file to use as the article image
        let imageUrl: string | null = null;
        const { data: mediaFiles } = await supabase
          .from('news_submission_media')
          .select('file_path')
          .eq('news_submission_id', submissionId)
          .limit(1);

        if (mediaFiles && mediaFiles.length > 0) {
          const { data: urlData } = supabase.storage
            .from('comment-media')
            .getPublicUrl(mediaFiles[0].file_path);
          imageUrl = urlData?.publicUrl || null;
        }

        // Create the news in the news table with all the new fields
        const { data: insertedNews, error: createError } = await supabase
          .from('news')
          .insert({
            title: submission.title,
            content: submission.content,
            location: submission.location,
            Address: submission.Address,
            villages: Array.isArray(submission.villages) ? submission.villages.join(', ') : submission.villages,
            latitude: submission.latitude,
            longitude: submission.longitude,
            date_posted: submission.date_posted,
            source: submission.source,
            created_by: submission.submitted_by,
            image_url: imageUrl
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating news:', createError);
          throw createError;
        }

        newNewsId = insertedNews?.id || null;
        console.log('News created successfully with id:', newNewsId);
      }

      // Update the submission status and delete if approved
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

      // If approved, delete the submission since it's now in the main news table
      if (status === 'approved') {
        const { error: deleteError } = await supabase
          .from('news_submissions')
          .delete()
          .eq('id', submissionId);

        if (deleteError) {
          console.error('Error deleting approved submission:', deleteError);
          // Don't throw here as the main operation succeeded
        }
      }

      console.log(`Culture submission ${status} successfully!`);
      toast.success(`Culture submission ${status} successfully!`);

      // New row is in `news`; invalidate caches so home, Culture tab, and trending refetch
      if (status === 'approved') {
        await queryClient.invalidateQueries({ queryKey: ['news'] });
        await queryClient.invalidateQueries({ queryKey: ['trending-news'] });
      }

      // Trigger auto-translation for the new news
      if (status === 'approved' && newNewsId) {
        translateContent('news', newNewsId, false);
      }
    } catch (error: any) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} news:`, error);
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} culture submission: ${error.message}`);
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
