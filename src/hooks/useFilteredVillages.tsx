import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useFilteredVillages = (selectedNeighborhood: string, allVillages: string[]) => {
  const { data: neighborhoodData } = useQuery({
    queryKey: ['neighborhood-villages', selectedNeighborhood],
    queryFn: async () => {
      if (selectedNeighborhood === 'all') {
        return null;
      }

      // Query all tables to find items in the selected neighborhood
      const [events, businesses, news, localResources] = await Promise.all([
        supabase
          .from('events')
          .select('villages')
          .or(`neighborhoods.ilike.%${selectedNeighborhood.replace('-', ' ')}%,location.ilike.%${selectedNeighborhood.replace('-', ' ')}%,address.ilike.%${selectedNeighborhood.replace('-', ' ')}%`),
        supabase
          .from('business')
          .select('villages')
          .or(`neighborhoods.ilike.%${selectedNeighborhood.replace('-', ' ')}%,location.ilike.%${selectedNeighborhood.replace('-', ' ')}%,address.ilike.%${selectedNeighborhood.replace('-', ' ')}%`),
        supabase
          .from('news')
          .select('villages')
          .or(`neighborhoods.ilike.%${selectedNeighborhood.replace('-', ' ')}%,location.ilike.%${selectedNeighborhood.replace('-', ' ')}%,address.ilike.%${selectedNeighborhood.replace('-', ' ')}%`),
        supabase
          .from('local_resources')
          .select('village')
          .or(`neighborhood.ilike.%${selectedNeighborhood.replace('-', ' ')}%,address.ilike.%${selectedNeighborhood.replace('-', ' ')}%`)
      ]);

      // Extract villages from all matching items
      const allMatchingVillages = [
        ...(events.data || []).map(item => item.villages),
        ...(businesses.data || []).map(item => item.villages),
        ...(news.data || []).map(item => item.villages),
        ...(localResources.data || []).map(item => item.village ? [item.village] : [])
      ].flat().filter(Boolean);

      return allMatchingVillages;
    },
    enabled: selectedNeighborhood !== 'all'
  });

  const filteredVillages = useMemo(() => {
    if (selectedNeighborhood === 'all') {
      return allVillages;
    }

    if (!neighborhoodData) {
      return [];
    }

    // Parse villages from the neighborhood data
    const availableVillages = new Set<string>();
    
    neighborhoodData.forEach(villagesData => {
      if (villagesData) {
        let villages: string[] = [];
        
        if (typeof villagesData === 'string') {
          try {
            villages = JSON.parse(villagesData);
          } catch {
            villages = villagesData.split(',').map(v => v.trim());
          }
        } else if (Array.isArray(villagesData)) {
          villages = villagesData;
        }
        
        villages.forEach(village => {
          if (village && typeof village === 'string') {
            availableVillages.add(village);
          }
        });
      }
    });

    return Array.from(availableVillages).sort();
  }, [selectedNeighborhood, neighborhoodData, allVillages]);

  return filteredVillages;
};