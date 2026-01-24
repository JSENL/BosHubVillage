import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, Calendar, Building2, Newspaper, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export const BookmarksSection = () => {
  const { t } = useTranslation();
  const { bookmarks, isLoading } = useBookmarks();

  // Fetch details for bookmarked items
  const { data: bookmarkedItems } = useQuery({
    queryKey: ['bookmarked-items', bookmarks],
    queryFn: async () => {
      if (!bookmarks?.length) return [];

      const results = [];

      // Group bookmarks by type
      const eventIds = bookmarks.filter(b => b.item_type === 'event').map(b => b.item_id);
      const businessIds = bookmarks.filter(b => b.item_type === 'business').map(b => b.item_id);
      const newsIds = bookmarks.filter(b => b.item_type === 'news').map(b => b.item_id);
      const serviceIds = bookmarks.filter(b => b.item_type === 'local_service').map(b => b.item_id);

      // Fetch events
      if (eventIds.length > 0) {
        const currentDate = new Date().toISOString().split('T')[0];
        const { data: events } = await supabase
          .from('events')
          .select('id, title, location, date')
          .gte('date', currentDate)
          .in('id', eventIds);
        
        if (events) {
          results.push(...events.map(event => ({ ...event, type: 'event' })));
        }
      }

      // Fetch businesses
      if (businessIds.length > 0) {
        const { data: businesses } = await supabase
          .from('business')
          .select('id, title, address, business_type')
          .in('id', businessIds);
        
        if (businesses) {
          results.push(...businesses.map(business => ({ ...business, type: 'business' })));
        }
      }

      // Fetch news
      if (newsIds.length > 0) {
        const { data: news } = await supabase
          .from('news')
          .select('id, title, source, date_posted')
          .in('id', newsIds);
        
        if (news) {
          results.push(...news.map(article => ({ ...article, type: 'news' })));
        }
      }

      // Fetch local services
      if (serviceIds.length > 0) {
        const { data: services } = await supabase
          .from('local_resources')
          .select('id, name, address, category')
          .in('id', serviceIds);
        
        if (services) {
          results.push(...services.map(service => ({ ...service, type: 'local_service', title: service.name })));
        }
      }

      return results;
    },
    enabled: !!bookmarks?.length,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            {t('bookmarks.yourBookmarks')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Hide component completely when no bookmarks
  if (!bookmarkedItems?.length) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'business':
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'news':
        return <Newspaper className="h-4 w-4 text-green-600" />;
      case 'local_service':
        return <MapPin className="h-4 w-4 text-orange-600" />;
      default:
        return <Bookmark className="h-4 w-4" />;
    }
  };

  const getItemLink = (item: any) => {
    switch (item.type) {
      case 'event':
        return `/event/${item.id}`;
      case 'business':
        return `/business/${item.id}`;
      case 'news':
        return `/news/${item.id}`;
      case 'local_service':
        return `/local-resource/${item.id}`;
      default:
        return '#';
    }
  };

  const getItemSubtext = (item: any) => {
    switch (item.type) {
      case 'event':
        return item.location;
      case 'business':
        return item.business_type;
      case 'news':
        return item.source;
      case 'local_service':
        return item.category;
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bookmark className="h-4 w-4" />
          {t('bookmarks.yourBookmarks')} ({bookmarkedItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
          {bookmarkedItems.slice(0, 6).map((item) => (
            <Link 
              key={`${item.type}-${item.id}`}
              to={getItemLink(item)}
              className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-medium text-sm line-clamp-1 truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{getItemSubtext(item)}</p>
                </div>
                <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                  {item.type.replace('_', ' ')}
                </Badge>
              </div>
            </Link>
          ))}
          
          {bookmarkedItems.length > 6 && (
            <div className="text-center pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                {t('bookmarks.moreBookmarks', { count: bookmarkedItems.length - 6 })}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
