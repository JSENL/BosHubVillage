
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FilterOptions {
  categories: string[];
  neighborhoods: string[];
  villages: string[];
}

export const useEventFilterOptions = () => {
  const [options, setOptions] = useState<FilterOptions>({
    categories: [],
    neighborhoods: [],
    villages: []
  });

  useEffect(() => {
    const fetchEventOptions = async () => {
      try {
        const { data: events } = await supabase
          .from('events')
          .select('category, neighborhoods, villages');

        if (events) {
          const categories = [...new Set(events.map(e => e.category).filter(Boolean))];
          const neighborhoods = [...new Set(
            events.flatMap(e => e.neighborhoods ? e.neighborhoods.split(',').map(n => n.trim()) : [])
          )];
          const villages = [...new Set(
            events.flatMap(e => {
              if (!e.villages) return [];
              try {
                return Array.isArray(e.villages) ? e.villages : JSON.parse(e.villages);
              } catch {
                return [e.villages];
              }
            })
          )];

          setOptions({ categories, neighborhoods, villages });
        }
      } catch (error) {
        console.error('Error fetching event filter options:', error);
      }
    };

    fetchEventOptions();
  }, []);

  return options;
};

export const useNewsFilterOptions = () => {
  const [options, setOptions] = useState<FilterOptions>({
    categories: [],
    neighborhoods: [],
    villages: []
  });

  useEffect(() => {
    const fetchNewsOptions = async () => {
      try {
        const { data: news } = await supabase
          .from('news')
          .select('location, villages');

        if (news) {
          // Extract neighborhoods from location field
          const neighborhoods = [...new Set(
            news.map(n => n.location).filter(Boolean)
          )];
          
          const villages = [...new Set(
            news.flatMap(n => {
              if (!n.villages) return [];
              try {
                return Array.isArray(n.villages) ? n.villages : JSON.parse(n.villages);
              } catch {
                return [n.villages];
              }
            })
          )];

          // News categories are typically predefined
          const categories = ['local', 'business', 'community', 'events', 'government'];

          setOptions({ categories, neighborhoods, villages });
        }
      } catch (error) {
        console.error('Error fetching news filter options:', error);
      }
    };

    fetchNewsOptions();
  }, []);

  return options;
};

export const useBusinessFilterOptions = () => {
  const [options, setOptions] = useState<FilterOptions>({
    categories: [],
    neighborhoods: [],
    villages: []
  });

  useEffect(() => {
    const fetchBusinessOptions = async () => {
      try {
        const { data: businesses } = await supabase
          .from('business')
          .select('business_type, neighborhood, villages');

        if (businesses) {
          const categories = [...new Set(businesses.map(b => b.business_type).filter(Boolean))];
          const neighborhoods = [...new Set(businesses.map(b => b.neighborhood).filter(Boolean))];
          const villages = [...new Set(
            businesses.flatMap(b => {
              if (!b.villages) return [];
              try {
                return Array.isArray(b.villages) ? b.villages : JSON.parse(b.villages);
              } catch {
                return [b.villages];
              }
            })
          )];

          setOptions({ categories, neighborhoods, villages });
        }
      } catch (error) {
        console.error('Error fetching business filter options:', error);
      }
    };

    fetchBusinessOptions();
  }, []);

  return options;
};

export const useLocalServiceFilterOptions = () => {
  const [options, setOptions] = useState<FilterOptions>({
    categories: [],
    neighborhoods: [],
    villages: []
  });

  useEffect(() => {
    const fetchLocalServiceOptions = async () => {
      try {
        const { data: services } = await supabase
          .from('local_services_nonprofits')
          .select('category, neighborhood, village');

        if (services) {
          const categories = [...new Set(services.map(s => s.category).filter(Boolean))];
          const neighborhoods = [...new Set(services.map(s => s.neighborhood).filter(Boolean))];
          const villages = [...new Set(services.map(s => s.village).filter(Boolean))];

          setOptions({ categories, neighborhoods, villages });
        }
      } catch (error) {
        console.error('Error fetching local service filter options:', error);
      }
    };

    fetchLocalServiceOptions();
  }, []);

  return options;
};
