import { Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { UnifiedItem } from '@/types/unifiedItem';
import { eventDetailPath } from '@/lib/eventUrl';

interface RecentlyViewedSectionProps {
  items: UnifiedItem[];
}

const normalizeItemType = (type: string) =>
  type === 'local_service' ? 'local-service' : type;

const itemPath = (item: UnifiedItem) => {
  if (item.type === 'event' || item.type === 'past-event') {
    return eventDetailPath({ slug: item.slug, id: item.id });
  }
  if (item.type === 'business') return `/business/${item.id}`;
  if (item.type === 'news') return `/news/${item.id}`;
  return `/local-resource/${item.id}`;
};

export const RecentlyViewedSection = ({ items }: RecentlyViewedSectionProps) => {
  const { recentlyViewed, isLoading } = useRecentlyViewed();

  const viewedItems = (recentlyViewed ?? [])
    .map((entry) =>
      items.find(
        (item) =>
          item.id === entry.item_id &&
          item.type === normalizeItemType(entry.item_type)
      )
    )
    .filter((item): item is UnifiedItem => Boolean(item))
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Continue browsing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (viewedItems.length === 0) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Continue browsing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {viewedItems.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            to={itemPath(item)}
            className="flex items-center justify-between gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border hover:bg-muted/50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.title || item.name}</p>
              <Badge variant="secondary" className="mt-1 text-[10px] capitalize">
                {item.type.replace('-', ' ')}
              </Badge>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};
