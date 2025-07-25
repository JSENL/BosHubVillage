
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FilterOptions {
  categories: string[];
  locations: string[];
  businessTypes: string[];
  villages: string[];
  neighborhoods: string[];
  eventCategories: string[];
  sources: string[];
}

export const useDatabaseFilterOptions = () => {
  return useQuery({
    queryKey: ['database-filter-options'],
    queryFn: async (): Promise<FilterOptions> => {
      console.log('Fetching filter options from database...');
      
      try {
        // Fetch business data from Supabase
        const { data: businesses, error: businessError } = await supabase
          .from('business')
          .select('business_type, neighborhood, villages')
          .not('business_type', 'is', null)
          .not('neighborhood', 'is', null);

        if (businessError) {
          console.error('Error fetching business data:', businessError);
          throw businessError;
        }

        // Fetch event categories and locations
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('category, neighborhoods, villages')
          .not('category', 'is', null)
          .not('neighborhoods', 'is', null);

        if (eventsError) {
          console.error('Error fetching events data:', eventsError);
          throw eventsError;
        }

        // Fetch news sources and locations
        const { data: news, error: newsError } = await supabase
          .from('news')
          .select('source, location, villages')
          .not('source', 'is', null)
          .not('location', 'is', null);

        if (newsError) {
          console.error('Error fetching news data:', newsError);
          throw newsError;
        }

        // Fetch local resource categories and locations
        const { data: localResources, error: localResourcesError } = await supabase
          .from('local_resources')
          .select('category, neighborhood, village')
          .not('category', 'is', null)
          .not('neighborhood', 'is', null);

        if (localResourcesError) {
          console.error('Error fetching local resources data:', localResourcesError);
          throw localResourcesError;
        }

        // Process business data
        const businessTypes = new Set<string>();
        const businessNeighborhoods = new Set<string>();
        const businessVillages = new Set<string>();

        businesses?.forEach(business => {
          if (business.business_type) businessTypes.add(business.business_type);
          if (business.neighborhood) businessNeighborhoods.add(business.neighborhood);
          if (business.villages) {
            // Handle both string and array formats
            const villageList = typeof business.villages === 'string' 
              ? business.villages.split(',').map(v => v.trim())
              : Array.isArray(business.villages) 
                ? business.villages
                : [];
            villageList.forEach(village => businessVillages.add(village));
          }
        });

        // Process events data
        const eventCategories = new Set<string>();
        const eventNeighborhoods = new Set<string>();
        const eventVillages = new Set<string>();

        events?.forEach(event => {
          if (event.category) eventCategories.add(event.category);
          if (event.neighborhoods) {
            const neighborhoods = event.neighborhoods.split(',').map(n => n.trim());
            neighborhoods.forEach(neighborhood => eventNeighborhoods.add(neighborhood));
          }
          if (event.villages) {
            const villageList = event.villages.split(',').map(v => v.trim());
            villageList.forEach(village => eventVillages.add(village));
          }
        });

        // Process news data
        const newsSources = new Set<string>();
        const newsLocations = new Set<string>();
        const newsVillages = new Set<string>();

        news?.forEach(item => {
          if (item.source) newsSources.add(item.source);
          if (item.location) newsLocations.add(item.location);
          if (item.villages) {
            const villageList = item.villages.split(',').map(v => v.trim());
            villageList.forEach(village => newsVillages.add(village));
          }
        });

        // Process local resources data
        const localResourceCategories = new Set<string>();
        const localResourceNeighborhoods = new Set<string>();
        const localResourceVillages = new Set<string>();

        localResources?.forEach(resource => {
          if (resource.category) localResourceCategories.add(resource.category);
          if (resource.neighborhood) localResourceNeighborhoods.add(resource.neighborhood);
          if (resource.village) localResourceVillages.add(resource.village);
        });

        // Combine all categories
        const allCategories = new Set([
          ...Array.from(businessTypes),
          ...Array.from(eventCategories),
          ...Array.from(localResourceCategories)
        ]);

        // Combine all locations (neighborhoods)
        const allLocations = new Set([
          ...Array.from(businessNeighborhoods),
          ...Array.from(eventNeighborhoods),
          ...Array.from(newsLocations),
          ...Array.from(localResourceNeighborhoods)
        ]);

        // Combine all villages
        const allVillages = new Set([
          ...Array.from(businessVillages),
          ...Array.from(eventVillages),
          ...Array.from(newsVillages),
          ...Array.from(localResourceVillages)
        ]);

        const filterOptions: FilterOptions = {
          categories: Array.from(allCategories).filter(Boolean).sort(),
          locations: Array.from(allLocations).filter(Boolean).sort(),
          businessTypes: Array.from(businessTypes).filter(Boolean).sort(),
          villages: Array.from(allVillages).filter(Boolean).sort(),
          neighborhoods: Array.from(allLocations).filter(Boolean).sort(),
          eventCategories: Array.from(eventCategories).filter(Boolean).sort(),
          sources: Array.from(newsSources).filter(Boolean).sort()
        };

        console.log('Successfully fetched filter options:', filterOptions);
        return filterOptions;

      } catch (error) {
        console.error('Error in useDatabaseFilterOptions:', error);
        // Return empty filter options as fallback
        return {
          categories: [],
          locations: [],
          businessTypes: [],
          villages: [],
          neighborhoods: [],
          eventCategories: [],
          sources: []
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Export specific filter hooks for different components
export const useEventFilterOptions = () => {
  const { data } = useDatabaseFilterOptions();
  return {
    categories: data?.eventCategories || [],
    neighborhoods: data?.neighborhoods || [],
    villages: data?.villages || []
  };
};

export const useNewsFilterOptions = () => {
  const { data } = useDatabaseFilterOptions();
  return {
    categories: data?.sources || [],
    neighborhoods: data?.neighborhoods || [],
    villages: data?.villages || []
  };
};

export const useBusinessFilterOptions = () => {
  const { data } = useDatabaseFilterOptions();
  return {
    categories: data?.businessTypes || [],
    neighborhoods: data?.neighborhoods || [],
    villages: data?.villages || []
  };
};

export const useLocalServiceFilterOptions = () => {
  const { data } = useDatabaseFilterOptions();
  return {
    categories: data?.categories || [],
    neighborhoods: data?.neighborhoods || [],
    villages: data?.villages || []
  };
};
