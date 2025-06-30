
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGeocoding } from './useGeocoding';

export const useLocalServiceSubmissionOperations = () => {
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
          .from('local_services_nonprofits_submissions')
          .select('*')
          .eq('id', submissionId)
          .single();

        if (fetchError) throw fetchError;

        let latitude = submission.latitude;
        let longitude = submission.longitude;

        // Try to geocode the service address if coordinates are missing and geocoding is available
        if ((!latitude || !longitude) && submission.address && isReady) {
          console.log('Attempting to geocode local service address:', submission.address);
          const geocodeResult = await geocode(submission.address);
          if (geocodeResult) {
            latitude = geocodeResult.latitude;
            longitude = geocodeResult.longitude;
            console.log('Successfully geocoded local service address:', { latitude, longitude });
          }
        }

        // Create the local service in the local_services_nonprofits table
        const { error: createError } = await supabase
          .from('local_services_nonprofits')
          .insert({
            name: submission.name,
            category: submission.category,
            address: submission.address,
            neighborhood: submission.neighborhood,
            village: submission.village,
            description: submission.description,
            latitude,
            longitude
          });

        if (createError) throw createError;
      }

      // Update the submission status
      const { error } = await supabase
        .from('local_services_nonprofits_submissions')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Local service ${status} successfully!`);
    } catch (error: any) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} local service:`, error);
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} local service: ${error.message}`);
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
