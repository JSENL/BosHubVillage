
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LocalResourceSubmission } from '@/types/localServices';

export const useLocalServiceSubmissions = () => {
  return useQuery({
    queryKey: ['local-resource-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_resources_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LocalResourceSubmission[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
