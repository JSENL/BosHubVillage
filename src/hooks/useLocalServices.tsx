
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LocalResource } from '@/types/localServices';

export const useLocalServices = () => {
  return useQuery({
    queryKey: ['local-resources'],
    queryFn: async () => {
      console.log('Fetching local resources from Supabase...');
      const { data, error } = await supabase
        .from('local_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching local resources:', error);
        throw error;
      }
      
      console.log('Fetched local resources:', data?.length || 0, 'items');
      return data as LocalResource[];
    },
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 0, // Don't cache results
  });
};
