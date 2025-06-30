
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LocalResource } from '@/types/localServices';

export const useLocalServices = () => {
  return useQuery({
    queryKey: ['local-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LocalResource[];
    },
  });
};
