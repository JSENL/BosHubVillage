
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSubmission } from '@/types/submissions';

export const useBusinessSubmissions = () => {
  return useQuery({
    queryKey: ['business-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BusinessSubmission[];
    },
  });
};
