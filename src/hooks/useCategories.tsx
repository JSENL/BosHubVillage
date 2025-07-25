import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  type: 'business' | 'event' | 'news' | 'local_service';
  created_at: string;
}

export const useCategories = (type?: string) => {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Category[];
    }
  });
};

export const useBusinessCategories = () => useCategories('business');
export const useEventCategories = () => useCategories('event');
export const useNewsCategories = () => useCategories('news');
export const useLocalServiceCategories = () => useCategories('local_service');