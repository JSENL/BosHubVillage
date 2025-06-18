
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';

export const useBusiness = () => {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Business[];
    },
  });
};
