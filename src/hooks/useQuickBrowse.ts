import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type QuickBrowseItemType = 'event' | 'news' | 'business' | 'local-service';

export interface QuickBrowseEntry {
  id: string;
  item_type: QuickBrowseItemType;
  item_id: string;
  position: number;
}

const QUERY_KEY = ['quick_browse'];

async function fetchQuickBrowse(): Promise<QuickBrowseEntry[]> {
  const { data, error } = await supabase
    .from('quick_browse')
    .select('id, item_type, item_id, position')
    .order('position', { ascending: true });

  if (error) throw error;
  return (data ?? []) as QuickBrowseEntry[];
}

export function useQuickBrowse() {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchQuickBrowse,
  });

  const saveMutation = useMutation({
    mutationFn: async (items: { item_type: QuickBrowseItemType; item_id: string }[]) => {
      // Fetch current ids so we can delete (PostgREST requires a filter)
      const { data: existing } = await supabase.from('quick_browse').select('id');
      const ids = (existing ?? []).map(r => r.id);
      if (ids.length > 0) {
        const { error: deleteError } = await supabase.from('quick_browse').delete().in('id', ids);
        if (deleteError) throw deleteError;
      }

      if (items.length === 0) {
        return [];
      }

      const rows = items.slice(0, 10).map((item, index) => ({
        item_type: item.item_type,
        item_id: item.item_id,
        position: index,
      }));

      const { data, error } = await supabase
        .from('quick_browse')
        .insert(rows)
        .select('id, item_type, item_id, position')
        .order('position', { ascending: true });

      if (error) throw error;
      return (data ?? []) as QuickBrowseEntry[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  return {
    entries,
    isLoading,
    save: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    error: saveMutation.error,
  };
}

/** Returns ordered list of (item_type, item_id) for matching against UnifiedItems */
export function getQuickBrowseIds(entries: QuickBrowseEntry[]): { type: QuickBrowseItemType; id: string }[] {
  return entries.map(e => ({ type: e.item_type, id: e.item_id }));
}
