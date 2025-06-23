
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
      
      // Parse villages JSON string to array
      const businessWithParsedVillages = data?.map(business => ({
        ...business,
        villages: business.villages ? (typeof business.villages === 'string' ? JSON.parse(business.villages) : business.villages) : null
      })) || [];
      
      return businessWithParsedVillages as Business[];
    },
  });
};
