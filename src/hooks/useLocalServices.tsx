
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LocalService } from '@/types/localServices';

export const useLocalServices = () => {
  return useQuery({
    queryKey: ['local-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_services_nonprofits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as LocalService[];
    },
  });
};
