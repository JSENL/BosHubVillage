import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrending } from '@/hooks/useTrending';
import { TrendingUp, Calendar, Building2, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FallbackTrendingSection } from './FallbackTrendingSection';

export const TrendingSection = () => {
  const { t } = useTranslation();
  const { trendingEvents, trendingBusinesses, trendingNews, isLoading } = useTrending();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Now
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

  const hasContent = trendingEvents?.length || trendingBusinesses?.length || trendingNews?.length;

  if (!hasContent) {
    return <FallbackTrendingSection />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trending Events */}
        {trendingEvents && trendingEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-purple-600" />
              <h4 className="font-medium text-sm">Events</h4>
            </div>
            <div className="space-y-2">
              {trendingEvents.slice(0, 3).map((event) => (
                <Link 
                  key={event.id} 
                  to={`/event/${event.id}`}
                  className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(event.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trending Businesses */}
        {trendingBusinesses && trendingBusinesses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-sm">Businesses</h4>
            </div>
            <div className="space-y-2">
              {trendingBusinesses.slice(0, 3).map((business) => (
                <Link 
                  key={business.id} 
                  to={`/business/${business.id}`}
                  className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{business.title}</p>
                      <p className="text-xs text-muted-foreground">{business.business_type}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {business.neighborhood}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Trending News */}
        {trendingNews && trendingNews.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-sm">News</h4>
            </div>
            <div className="space-y-2">
              {trendingNews.slice(0, 3).map((news) => (
                <Link 
                  key={news.id} 
                  to={`/news/${news.id}`}
                  className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{news.title}</p>
                      <p className="text-xs text-muted-foreground">{news.source}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(news.date_posted).toLocaleDateString()}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};