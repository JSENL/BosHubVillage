
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

      // Extract villages from events
      eventsData.data?.forEach(item => {
        if (item.villages) {
          item.villages.forEach((village: string) => allVillages.add(village));
        }
      });

      // Extract villages from news
      newsData.data?.forEach(item => {
        if (item.villages) {
          item.villages.forEach((village: string) => allVillages.add(village));
        }
      });

      // Extract villages from business
      businessData.data?.forEach(item => {
        if (item.villages) {
          item.villages.forEach((village: string) => allVillages.add(village));
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
