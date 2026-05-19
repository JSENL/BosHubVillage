import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  AdminPendingCounts,
  EMPTY_ADMIN_PENDING_COUNTS,
} from '@/types/adminPendingCounts';

export const ADMIN_PENDING_COUNTS_QUERY_KEY = ['admin-pending-counts'] as const;

const SUBMISSION_TABLES = [
  'event_submissions',
  'news_submissions',
  'business_submissions',
  'local_resources_submissions',
] as const;

async function fetchPendingCount(table: (typeof SUBMISSION_TABLES)[number]): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) throw error;
  return count ?? 0;
}

async function fetchAdminPendingCounts(): Promise<AdminPendingCounts> {
  const [events, news, businesses, localResources] = await Promise.all([
    fetchPendingCount('event_submissions'),
    fetchPendingCount('news_submissions'),
    fetchPendingCount('business_submissions'),
    fetchPendingCount('local_resources_submissions'),
  ]);

  return {
    events,
    news,
    businesses,
    localResources,
    total: events + news + businesses + localResources,
  };
}

export const useAdminPendingCounts = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ADMIN_PENDING_COUNTS_QUERY_KEY,
    queryFn: fetchAdminPendingCounts,
    enabled: isAdmin,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-pending-submissions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'event_submissions' },
        () => {
          void queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_COUNTS_QUERY_KEY });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news_submissions' },
        () => {
          void queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_COUNTS_QUERY_KEY });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'business_submissions' },
        () => {
          void queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_COUNTS_QUERY_KEY });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'local_resources_submissions' },
        () => {
          void queryClient.invalidateQueries({ queryKey: ADMIN_PENDING_COUNTS_QUERY_KEY });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isAdmin, queryClient]);

  const counts = query.data ?? EMPTY_ADMIN_PENDING_COUNTS;

  return {
    counts,
    total: counts.total,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
