import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type ContentType = 'business' | 'event' | 'local_service';

interface ContentNewsLink {
  id: string;
  content_type: ContentType;
  content_id: string;
  news_id: string;
  created_at: string;
  created_by: string | null;
  news?: {
    id: string;
    title: string;
    date_posted: string;
    source: string;
  };
}

export const useContentNewsLinks = (contentType: ContentType, contentId: string) => {
  const queryClient = useQueryClient();

  // Fetch linked news articles for this content
  const { data: linkedNews, isLoading } = useQuery({
    queryKey: ['content-news-links', contentType, contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_news_links')
        .select(`
          id,
          content_type,
          content_id,
          news_id,
          created_at,
          created_by,
          news:news_id (
            id,
            title,
            date_posted,
            source
          )
        `)
        .eq('content_type', contentType)
        .eq('content_id', contentId);

      if (error) throw error;
      return data as ContentNewsLink[];
    },
    enabled: !!contentId
  });

  // Fetch available news articles to link
  const { data: availableNews } = useQuery({
    queryKey: ['available-news-for-linking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, date_posted, source')
        .order('date_posted', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  // Add a news link
  const addLinkMutation = useMutation({
    mutationFn: async (newsId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('content_news_links')
        .insert({
          content_type: contentType,
          content_id: contentId,
          news_id: newsId,
          created_by: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-news-links', contentType, contentId] });
      toast.success('News article linked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to link news article');
    }
  });

  // Remove a news link
  const removeLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('content_news_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-news-links', contentType, contentId] });
      toast.success('News link removed');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to remove link');
    }
  });

  return {
    linkedNews: linkedNews || [],
    availableNews: availableNews || [],
    isLoading,
    addLink: addLinkMutation.mutate,
    removeLink: removeLinkMutation.mutate,
    isAdding: addLinkMutation.isPending,
    isRemoving: removeLinkMutation.isPending
  };
};
