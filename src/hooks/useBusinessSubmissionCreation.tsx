
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useGeocoding } from './useGeocoding';

interface CreateBusinessSubmissionData {
  title: string;
  business_type: string;
  address: string;
  neighborhood: string;
  description: string;
  short_description: string | null;
}

export const useBusinessSubmissionCreation = () => {
  const { user } = useAuth();
  const { geocode, isReady } = useGeocoding();

  const submitBusiness = async (businessData: CreateBusinessSubmissionData) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Submitting business:', businessData);

      const { data, error } = await supabase
        .from('business_submissions')
        .insert({
          ...businessData,
          submitted_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Business submitted successfully! It will be reviewed by our admin team.');
      return data;
    } catch (error: any) {
      console.error('Error submitting business:', error);
      toast.error('Failed to submit business');
      throw error;
    }
  };

  return {
    submitBusiness
  };
};
