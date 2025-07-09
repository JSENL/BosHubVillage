
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGeocoding } from './useGeocoding';

export const useBusinessSubmissionOperations = () => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const { geocode, isReady } = useGeocoding();

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes: string) => {
    setActionLoading(true);
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (status === 'approved') {
        // Get the submission data
        const { data: submission, error: fetchError } = await supabase
          .from('business_submissions')
          .select('*')
          .eq('id', submissionId)
          .single();

        if (fetchError) throw fetchError;

        let latitude = submission.latitude;
        let longitude = submission.longitude;

        // Try to geocode the business address if coordinates are missing and geocoding is available
        if (submission.address && isReady && (!latitude || !longitude)) {
          console.log('Attempting to geocode business address:', submission.address);
          const geocodeResult = await geocode(submission.address);
          if (geocodeResult) {
            latitude = geocodeResult.latitude;
            longitude = geocodeResult.longitude;
            console.log('Successfully geocoded business address:', { latitude, longitude });
            
            // Update the submission with the geocoded coordinates
            const { error: updateError } = await supabase
              .from('business_submissions')
              .update({ latitude, longitude })
              .eq('id', submissionId);

            if (updateError) {
              console.error('Error updating submission with coordinates:', updateError);
            }
          }
        }

        // Create the business in the businesses table
        const { error: createError } = await supabase
          .from('business')
          .insert({
            title: submission.title,
            business_type: submission.business_type,
            address: submission.address,
            neighborhood: submission.neighborhood,
            description: submission.description,
            short_description: submission.short_description,
            villages: null,
            latitude,
            longitude,
            created_by: submission.submitted_by
          });

        if (createError) throw createError;
      }

      // Update the submission status
      const { error } = await supabase
        .from('business_submissions')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Business ${status} successfully!`);
    } catch (error: any) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} business:`, error);
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} business`);
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
