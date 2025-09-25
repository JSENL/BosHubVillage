import { useQuery } from '@tanstack/react-query';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';

export const useBusiness = () => {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      console.log('Fetching businesses from Supabase...');
      
      // First get basic business data, then manually fetch owners
      const { data: businessData, error: businessError } = await supabase
        .from('business')
        .select('*')
        .order('created_at', { ascending: false });

      if (businessError) {
        console.error('Error fetching businesses:', businessError);
        throw businessError;
      }

      // Then fetch business owners with profiles for each business
      const businessesWithOwners = await Promise.all(
        (businessData || []).map(async (business) => {
          const { data: ownerData } = await supabase
            .from('business_owner')
            .select(`
              id,
              owner_id,
              profiles (
                id,
                full_name,
                email
              )
            `)
            .eq('business_id', business.id);

          return {
            ...business,
            business_owner: ownerData || []
          };
        })
      );

      console.log(`Fetched ${businessesWithOwners?.length || 0} business items from Supabase with owners`);
      
      return businessesWithOwners;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};