import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PAGE_SIZE = 100;

interface PaginatedQueryOptions {
  table: string;
  queryKey: string[];
  orderBy?: { column: string; ascending?: boolean };
  filters?: (query: any) => any;
  transform?: (data: any[]) => any[];
  staleTime?: number;
  gcTime?: number;
}

/**
 * Fetches all rows from a Supabase table using paginated range queries.
 * This avoids hitting the default 1000-row limit and reduces initial payload.
 */
export const usePaginatedQuery = <T>({
  table,
  queryKey,
  orderBy = { column: 'created_at', ascending: false },
  filters,
  transform,
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000,
}: PaginatedQueryOptions) => {
  return useQuery<T[]>({
    queryKey,
    queryFn: async () => {
      const allData: any[] = [];
      let page = 0;
      let hasMore = true;

      while (hasMore) {
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase.from(table as any).select('*');

        if (filters) {
          query = filters(query);
        }

        query = query
          .order(orderBy.column, { ascending: orderBy.ascending ?? false })
          .range(from, to);

        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
          allData.push(...data);
          hasMore = data.length === PAGE_SIZE;
        } else {
          hasMore = false;
        }

        page++;
      }

      return transform ? transform(allData) : allData;
    },
    staleTime,
    gcTime,
  });
};
