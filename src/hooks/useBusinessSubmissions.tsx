import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSubmission } from '@/types/submissions';

export const useBusinessSubmissions = () => {
  return useQuery({
    queryKey: ['businessSubmissions'],
    queryFn: async () => {
      console.log('Fetching business submissions from Supabase...');
      
      const { data, error } = await supabase
        .from('business_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching business submissions:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} approved business submissions`);
      
      return data as BusinessSubmission[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};