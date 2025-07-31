
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCategoryNames } from './useUnifiedCategories';

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
        // Fetch categories from the categories table only
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('name, type');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          throw categoriesError;
        }

        // Fetch business data from Supabase
        const { data: businesses, error: businessError } = await supabase
          .from('business')
          .select('neighborhood, villages')
          .not('neighborhood', 'is', null);

        if (businessError) {
          console.error('Error fetching business data:', businessError);
          throw businessError;
        }

        // Fetch event locations
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('neighborhoods, villages')
          .not('neighborhoods', 'is', null);

        if (eventsError) {
          console.error('Error fetching events data:', eventsError);
          throw eventsError;
        }

        // Fetch news locations
        const { data: news, error: newsError } = await supabase
          .from('news')
          .select('location, villages')
          .not('location', 'is', null);

        if (newsError) {
          console.error('Error fetching news data:', newsError);
          throw newsError;
        }

        // Fetch local resource locations
        const { data: localResources, error: localResourcesError } = await supabase
          .from('local_resources')
          .select('neighborhood, village')
          .not('neighborhood', 'is', null);

        if (localResourcesError) {
          console.error('Error fetching local resources data:', localResourcesError);
          throw localResourcesError;
        }

        // Process business data
        const businessNeighborhoods = new Set<string>();
        const businessVillages = new Set<string>();

        businesses?.forEach(business => {
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
        const eventNeighborhoods = new Set<string>();
        const eventVillages = new Set<string>();

        events?.forEach(event => {
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
        const newsLocations = new Set<string>();
        const newsVillages = new Set<string>();

        news?.forEach(item => {
          if (item.location) newsLocations.add(item.location);
          if (item.villages) {
            const villageList = item.villages.split(',').map(v => v.trim());
            villageList.forEach(village => newsVillages.add(village));
          }
        });

        // Process local resources data
        const localResourceNeighborhoods = new Set<string>();
        const localResourceVillages = new Set<string>();

        localResources?.forEach(resource => {
          if (resource.neighborhood) localResourceNeighborhoods.add(resource.neighborhood);
          if (resource.village) localResourceVillages.add(resource.village);
        });

        // Get categories from database grouped by type
        const dbBusinessTypes = categories?.filter(c => c.type === 'business').map(c => c.name) || [];
        const dbEventCategories = categories?.filter(c => c.type === 'event').map(c => c.name) || [];
        const dbLocalServiceCategories = categories?.filter(c => c.type === 'local_service').map(c => c.name) || [];
        const dbNewsCategories = categories?.filter(c => c.type === 'news').map(c => c.name) || [];

        // Combine all categories from database
        const allCategories = new Set([
          ...dbBusinessTypes,
          ...dbEventCategories,
          ...dbLocalServiceCategories,
          ...dbNewsCategories
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
          businessTypes: dbBusinessTypes.filter(Boolean).sort(),
          villages: Array.from(allVillages).filter(Boolean).sort(),
          neighborhoods: Array.from(allLocations).filter(Boolean).sort(),
          eventCategories: dbEventCategories.filter(Boolean).sort(),
          sources: dbNewsCategories.filter(Boolean).sort()
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

// New unified filter options hook
export const useUnifiedFilterOptions = (selectedType?: string) => {
  const { data } = useDatabaseFilterOptions();
  const categoryNames = useCategoryNames(selectedType);
  
  if (!data) {
    return {
      categories: [],
      neighborhoods: [],
      villages: []
    };
  }

  // Return appropriate categories based on selected type
  let categories: string[] = [];
  
  if (selectedType === 'all' || !selectedType) {
    categories = data.categories;
  } else {
    categories = categoryNames;
  }

  return {
    categories: categories.filter(Boolean).sort(),
    neighborhoods: data.neighborhoods.filter(Boolean).sort(),
    villages: data.villages.filter(Boolean).sort()
  };
};
