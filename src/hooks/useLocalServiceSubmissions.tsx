
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LocalServiceSubmission } from '@/types/localServices';

export const useLocalServiceSubmissions = () => {
  return useQuery({
    queryKey: ['local-service-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_services_nonprofits_submissions')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LocalServiceSubmission[];
    },
  });
};
