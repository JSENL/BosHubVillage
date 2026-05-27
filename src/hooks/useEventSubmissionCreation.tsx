
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useGeocoding } from './useGeocoding';
import { eventSubmissionSchema, validateFormData } from '@/utils/validation/formSchemas';
import { uploadMediaFiles } from '@/services/mediaUploadService';
import { uploadCoverImage } from '@/lib/coverImageUpload';

interface CreateEventSubmissionData {
  title: string;
  description: string;
  category: string;
  event_type: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  website_link?: string | null;
  price: number;
  max_attendees: number | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  registration_required?: boolean;
  neighborhoods: string[] | null;
  villages: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const useEventSubmissionCreation = () => {
  const { user } = useAuth();
  const { geocode, isReady } = useGeocoding();

  const submitEvent = async (
    eventData: CreateEventSubmissionData,
    mediaFiles?: File[],
    coverFile?: File | null
  ) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate event data with Zod schema
      const validation = validateFormData(eventSubmissionSchema, {
        ...eventData,
        price: eventData.price || undefined,
        max_attendees: eventData.max_attendees || undefined,
        website_link: eventData.website_link || undefined
      });

      if (!validation.success) {
        const errorValidation = validation as { success: false; errors: string[] };
        toast.error('Validation Error', {
          description: errorValidation.errors[0]
        });
        throw new Error(errorValidation.errors[0]);
      }

      const validatedData = validation.data;

      let latitude = eventData.latitude;
      let longitude = eventData.longitude;

      // If coordinates are not provided and geocoding is available, try to geocode the location
      if ((!latitude || !longitude) && validatedData.location && isReady) {
        console.log('Attempting to geocode event location:', validatedData.location);
        const geocodeResult = await geocode(validatedData.location);
        if (geocodeResult) {
          latitude = geocodeResult.latitude;
          longitude = geocodeResult.longitude;
          console.log('Successfully geocoded event location:', { latitude, longitude });
        }
      }

      console.log('Submitting event with coordinates:', {
        title: validatedData.title,
        location: validatedData.location,
        event_type: validatedData.event_type,
        neighborhoods: eventData.neighborhoods,
        latitude,
        longitude
      });

      let coverImageUrl: string | null = null;
      if (coverFile) {
        try {
          coverImageUrl = await uploadCoverImage(coverFile, user.id);
        } catch (coverErr) {
          console.error('Cover image upload failed:', coverErr);
          toast.warning('Cover image could not be uploaded; you can add one after approval.');
        }
      }

      const { data, error } = await supabase
        .from('event_submissions')
        .insert({
          title: validatedData.title,
          description: validatedData.description || null,
          category: validatedData.category,
          event_type: validatedData.event_type,
          date: validatedData.date,
          start_time: validatedData.start_time || null,
          end_time: validatedData.end_time || null,
          location: validatedData.location,
          website_link: validatedData.website_link || null,
          price: validatedData.price || 0,
          max_attendees: validatedData.max_attendees || null,
          is_recurring: validatedData.is_recurring || false,
          recurring_pattern: validatedData.recurring_pattern || null,
          registration_required: validatedData.registration_required || false,
          neighborhoods: eventData.neighborhoods || null,
          villages: validatedData.villages || null,
          latitude,
          longitude,
          image_url: coverImageUrl,
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const files = mediaFiles ?? [];
      if (files.length > 0 && data) {
        try {
          const uploadedFiles = await uploadMediaFiles(files, user.id);
          const mediaRecords = uploadedFiles.map((file) => ({
            event_submission_id: data.id,
            file_path: file.path,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
          }));

          const { error: mediaError } = await supabase
            .from('event_submissions_media')
            .insert(mediaRecords);

          if (mediaError) {
            console.error('Failed to save event submission media records:', mediaError);
            toast.error(
              'Media files failed to upload, but your event submission was saved.'
            );
          } else {
            if (!coverImageUrl) {
              const firstImage = uploadedFiles.find((f) =>
                f.type.startsWith('image/')
              );
              if (firstImage) {
                const { data: urlData } = supabase.storage
                  .from('comment-media')
                  .getPublicUrl(firstImage.path);
                const publicUrl = urlData?.publicUrl ?? null;
                if (publicUrl) {
                  const { error: imageUrlError } = await supabase
                    .from('event_submissions')
                    .update({ image_url: publicUrl })
                    .eq('id', data.id);
                  if (imageUrlError) {
                    console.error(
                      'Failed to set event submission image_url:',
                      imageUrlError
                    );
                  }
                }
              }
            }
          }
        } catch (mediaErr) {
          console.error('Event media upload failed:', mediaErr);
          toast.error(
            'Media files failed to upload, but your event submission was saved.'
          );
        }
      }

      toast.success('Event submitted successfully! It will be reviewed by our admin team.');
      return data;
    } catch (error: any) {
      console.error('Error submitting event:', error);
      if (!error.message?.includes('Validation Error')) {
        toast.error('Failed to submit event');
      }
      throw error;
    }
  };

  return {
    submitEvent
  };
};
