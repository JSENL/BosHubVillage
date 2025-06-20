
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

interface CreateEventSubmissionData {
  title: string;
  description: string;
  category: string;
  event_type: string;
  date: string;
  time: string;
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

  const submitEvent = async (eventData: CreateEventSubmissionData) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Submitting event with coordinates and new fields:', {
        title: eventData.title,
        location: eventData.location,
        event_type: eventData.event_type,
        neighborhoods: eventData.neighborhoods,
        latitude: eventData.latitude,
        longitude: eventData.longitude
      });

      const { data, error } = await supabase
        .from('event_submissions')
        .insert({
          ...eventData,
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
