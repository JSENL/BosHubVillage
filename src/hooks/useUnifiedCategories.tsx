import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  type: 'business' | 'event' | 'news' | 'local_service';
  created_at: string;
}

export const useUnifiedCategories = (selectedType?: string) => {
  return useQuery({
    queryKey: ['unified-categories', selectedType],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      // If a specific type is selected, filter by that type
      if (selectedType && selectedType !== 'all') {
        // Map unified types to database types
        const typeMap: Record<string, string> = {
          'local-service': 'local_service'
        };
        const dbType = typeMap[selectedType] || selectedType;
        query = query.eq('type', dbType);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
      
      return data as Category[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Helper function to get category names for filtering
export const useCategoryNames = (selectedType?: string) => {
  const { data: categories } = useUnifiedCategories(selectedType);
  
  if (!categories) return [];
  
  return categories.map(category => category.name);
};

// Helper function to check if a content item matches a selected category
export const matchesCategory = (item: any, selectedCategory: string): boolean => {
  if (selectedCategory === 'all') return true;
  
  // Check different possible category fields based on content type
  const categoryFields = [
    item.category,
    item.business_type,
    item.source // for news items that might use source as category
  ];
  
  return categoryFields.some(field => 
    field && field.toLowerCase() === selectedCategory.toLowerCase()
  );
};