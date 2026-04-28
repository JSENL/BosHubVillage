import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LinkedContent {
  id: string;
  content_type: 'business' | 'event' | 'local_service';
  content_id: string;
  created_at: string;
  business?: {
    id: string;
    title: string;
    business_type: string;
    neighborhood: string;
  };
  event?: {
    id: string;
    slug?: string;
    title: string;
    category: string;
    date: string;
  };
  local_resource?: {
    id: string;
    name: string;
    category: string;
    neighborhood: string;
  };
}

export const useNewsLinkedContent = (newsId: string) => {
  const { data: linkedContent, isLoading } = useQuery({
    queryKey: ['news-linked-content', newsId],
    queryFn: async () => {
      // Get all links for this news article
      const { data: links, error } = await supabase
        .from('content_news_links')
        .select('id, content_type, content_id, created_at')
        .eq('news_id', newsId);

      if (error) throw error;
      if (!links || links.length === 0) return [];

      // Fetch details for each linked content type
      const businessIds = links.filter(l => l.content_type === 'business').map(l => l.content_id);
      const eventIds = links.filter(l => l.content_type === 'event').map(l => l.content_id);
      const localServiceIds = links.filter(l => l.content_type === 'local_service').map(l => l.content_id);

      const [businesses, events, localresources] = await Promise.all([
        businessIds.length > 0 
          ? supabase.from('business').select('id, title, business_type, neighborhood').in('id', businessIds)
          : { data: [] },
        eventIds.length > 0 
          ? supabase.from('events').select('id, slug, title, category, date').in('id', eventIds)
          : { data: [] },
        localServiceIds.length > 0 
          ? supabase.from('local_resources').select('id, name, category, neighborhood').in('id', localServiceIds)
          : { data: [] }
      ]);

      // Map the content details back to links
      return links.map(link => {
        const result: LinkedContent = {
          id: link.id,
          content_type: link.content_type as LinkedContent['content_type'],
          content_id: link.content_id,
          created_at: link.created_at
        };

        if (link.content_type === 'business') {
          result.business = businesses.data?.find(b => b.id === link.content_id);
        } else if (link.content_type === 'event') {
          result.event = events.data?.find(e => e.id === link.content_id);
        } else if (link.content_type === 'local_service') {
          result.local_resource = localresources.data?.find(ls => ls.id === link.content_id);
        }

        return result;
      });
    },
    enabled: !!newsId
  });

  return {
    linkedContent: linkedContent || [],
    isLoading
  };
};
