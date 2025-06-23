
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useVillages = () => {
  const [villages, setVillages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVillages = async () => {
    try {
      // Fetch unique villages from events, news, and business tables
      const [eventsData, newsData, businessData] = await Promise.all([
        supabase.from('events').select('villages').not('villages', 'is', null),
        supabase.from('news').select('villages').not('villages', 'is', null),
        supabase.from('business').select('villages').not('villages', 'is', null)
      ]);

      const allVillages = new Set<string>();

      // Helper function to safely parse villages data
      const parseVillages = (villagesData: any) => {
        if (!villagesData) return [];
        
        // If it's already an array, return it
        if (Array.isArray(villagesData)) {
          return villagesData;
        }
        
        // If it's a string, try to parse as JSON first
        if (typeof villagesData === 'string') {
          // Check if it looks like a JSON array (starts with [ and ends with ])
          if (villagesData.trim().startsWith('[') && villagesData.trim().endsWith(']')) {
            try {
              return JSON.parse(villagesData);
            } catch (error) {
              console.warn('Failed to parse villages as JSON:', villagesData, error);
              return [];
            }
          } else {
            // If it's a plain string, treat it as a single village
            return [villagesData];
          }
        }
        
        return [];
      };

      // Extract villages from events
      eventsData.data?.forEach(item => {
        if (item.villages) {
          const villagesArray = parseVillages(item.villages);
          villagesArray.forEach((village: string) => {
            if (village && typeof village === 'string') {
              allVillages.add(village.trim());
            }
          });
        }
      });

      // Extract villages from news
      newsData.data?.forEach(item => {
        if (item.villages) {
          const villagesArray = parseVillages(item.villages);
          villagesArray.forEach((village: string) => {
            if (village && typeof village === 'string') {
              allVillages.add(village.trim());
            }
          });
        }
      });

      // Extract villages from business
      businessData.data?.forEach(item => {
        if (item.villages) {
          const villagesArray = parseVillages(item.villages);
          villagesArray.forEach((village: string) => {
            if (village && typeof village === 'string') {
              allVillages.add(village.trim());
            }
          });
        }
      });

      setVillages(Array.from(allVillages).sort());
    } catch (error: any) {
      console.error('Error fetching villages:', error);
      toast.error('Failed to load villages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  return {
    villages,
    loading,
    refetch: fetchVillages
  };
};
