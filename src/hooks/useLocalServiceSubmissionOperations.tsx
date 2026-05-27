
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGeocoding } from './useGeocoding';
import { useAutoTranslate } from './useAutoTranslate';

export const uselocalresourcesubmissionOperations = () => {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState(false);
  const { geocode, isReady } = useGeocoding();
  const { translateContent } = useAutoTranslate();

  const updateSubmissionStatus = async (submissionId: string, status: 'approved' | 'rejected', adminNotes: string) => {
    setActionLoading(true);
    let newResourceId: string | null = null;
    
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (status === 'approved') {
        // Get the submission data
        const { data: submission, error: fetchError } = await supabase
          .from('local_resources_submissions')
          .select('*')
          .eq('id', submissionId)
          .single();

        if (fetchError) throw fetchError;

        let latitude = submission.latitude;
        let longitude = submission.longitude;

        // Try to geocode the resource address if coordinates are missing and geocoding is available
        if ((!latitude || !longitude) && submission.address && isReady) {
          console.log('Attempting to geocode local resource address:', submission.address);
          const geocodeResult = await geocode(submission.address);
          if (geocodeResult) {
            latitude = geocodeResult.latitude;
            longitude = geocodeResult.longitude;
            console.log('Successfully geocoded local resource address:', { latitude, longitude });
          }
        }

        // Create the local resource in the local_resources table
        const { data: insertedResource, error: createError } = await supabase
          .from('local_resources')
          .insert({
            name: submission.name,
            category: submission.category,
            address: submission.address,
            neighborhood: submission.neighborhood,
            village: submission.village,
            description: submission.description,
            latitude,
            longitude,
            website_link: submission.website_link ?? null,
            image_url: submission.image_url ?? null,
          })
          .select('id')
          .single();

        if (createError) throw createError;
        
        newResourceId = insertedResource?.id || null;
      }

      // Update the submission status
      const { error } = await supabase
        .from('local_resources_submissions')
        .update({
          status,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', submissionId);

      if (error) throw error;

      toast.success(`Local resource ${status} successfully!`);

      // Trigger auto-translation for the new local resource
      if (status === 'approved' && newResourceId) {
        translateContent('local_resources', newResourceId, false);
        supabase.functions
          .invoke('send-content-alerts', {
            body: { itemType: 'local-resource', itemId: newResourceId },
          })
          .catch((notifyError) => {
            console.error('Local resource alert dispatch failed:', notifyError);
          });
      }
    } catch (error: any) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} local resource:`, error);
      toast.error(`Failed to ${status === 'approved' ? 'approve' : 'reject'} local resource: ${error.message}`);
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
