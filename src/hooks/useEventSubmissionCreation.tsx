
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useGeocoding } from './useGeocoding';

interface CreateEventSubmissionData {
  title: string;
  description: string;
  category: string;
  event_type: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number;
  max_attendees: number | null;
  is_recurring: boolean;
  recurring_pattern: string | null;
  neighborhoods: string[] | null;
  latitude: number | null;
  longitude: number | null;
}

export const useEventSubmissionCreation = () => {
  const { user } = useAuth();
  const { geocode, isReady } = useGeocoding();

  const submitEvent = async (eventData: CreateEventSubmissionData) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      let latitude = eventData.latitude;
      let longitude = eventData.longitude;

      // If coordinates are not provided and geocoding is available, try to geocode the location
      if ((!latitude || !longitude) && eventData.location && isReady) {
        console.log('Attempting to geocode event location:', eventData.location);
        const geocodeResult = await geocode(eventData.location);
        if (geocodeResult) {
          latitude = geocodeResult.latitude;
          longitude = geocodeResult.longitude;
          console.log('Successfully geocoded event location:', { latitude, longitude });
        }
      }

      console.log('Submitting event with coordinates:', {
        title: eventData.title,
        location: eventData.location,
        event_type: eventData.event_type,
        neighborhoods: eventData.neighborhoods,
        latitude,
        longitude
      });

      const { data, error } = await supabase
        .from('event_submissions')
        .insert({
          ...eventData,
          latitude,
          longitude,
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Event submitted successfully! It will be reviewed by our admin team.');
      return data;
    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast.error('Failed to submit event');
      throw error;
    }
  };

  return {
    submitEvent
  };
};
