import { useQuery } from '@tanstack/react-query';
import { Business } from '@/types/business';
import { mockBusinesses } from '@/data/mockBusiness';

export const useBusiness = () => {
  return useQuery({
    queryKey: ['business'],
    queryFn: async () => {
      console.log('Fetching businesses from mock data...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`Fetched ${mockBusinesses.length} business items from mock data`);
      
      return mockBusinesses as Business[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};