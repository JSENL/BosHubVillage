import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, Building2, Newspaper, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface UserContributionsProps {
  userId: string;
}

interface Contribution {
  id: string;
  title: string;
  type: 'event' | 'business' | 'news';
  created_at: string;
}

const INITIAL_DISPLAY_COUNT = 5;
const ITEMS_PER_PAGE = 10;

export const UserContributions = ({ userId }: UserContributionsProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: contributions, isLoading } = useQuery({
    queryKey: ['user-contributions', userId],
    queryFn: async () => {
      // Fetch all events, businesses, and news created by this user in parallel
      const [eventsRes, businessRes, newsRes] = await Promise.all([
        supabase
          .from('events')
          .select('id, title, created_at')
          .eq('created_by', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('business')
          .select('id, title, created_at')
          .eq('created_by', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('news')
          .select('id, title, created_at')
          .eq('created_by', userId)
          .order('created_at', { ascending: false }),
      ]);

      const allContributions: Contribution[] = [];

      if (eventsRes.data) {
        eventsRes.data.forEach((e) => {
          allContributions.push({
            id: e.id,
            title: e.title,
            type: 'event',
            created_at: e.created_at,
          });
        });
      }

      if (businessRes.data) {
        businessRes.data.forEach((b) => {
          allContributions.push({
            id: b.id,
            title: b.title,
            type: 'business',
            created_at: b.created_at,
          });
        });
      }

      if (newsRes.data) {
        newsRes.data.forEach((n) => {
          allContributions.push({
            id: n.id,
            title: n.title,
            type: 'news',
            created_at: n.created_at,
          });
        });
      }

      // Sort by created_at descending
      return allContributions.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!userId,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'business':
        return <Building2 className="h-4 w-4 text-amber-500" />;
      case 'news':
        return <Newspaper className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getLink = (type: string, id: string) => {
    switch (type) {
      case 'event':
        return `/event/${id}`;
      case 'business':
        return `/business/${id}`;
      case 'news':
        return `/news/${id}`;
      default:
        return '#';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return t('contributions.event', 'Event');
      case 'business':
        return t('contributions.business', 'Business');
      case 'news':
        return t('contributions.news', 'Culture');
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.contributions', 'Contributions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const totalCount = contributions?.length || 0;
  const hasMoreThanInitial = totalCount > INITIAL_DISPLAY_COUNT;
  const needsPagination = totalCount > ITEMS_PER_PAGE;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Determine which items to display
  let displayedContributions: Contribution[] = [];
  
  if (!isExpanded) {
    // Show first 5 items
    displayedContributions = contributions?.slice(0, INITIAL_DISPLAY_COUNT) || [];
  } else if (needsPagination) {
    // Show paginated items (10 per page)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    displayedContributions = contributions?.slice(startIndex, endIndex) || [];
  } else {
    // Show all items (between 6-10)
    displayedContributions = contributions || [];
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('profile.contributions', 'Contributions')} ({totalCount})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!contributions?.length ? (
          <p className="text-muted-foreground text-center py-6 text-sm">
            {t('profile.noContributions', 'No contributions yet.')}
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {displayedContributions.map((contribution) => (
                <Link
                  key={`${contribution.type}-${contribution.id}`}
                  to={getLink(contribution.type, contribution.id)}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="p-2 rounded-full bg-muted shrink-0">
                    {getIcon(contribution.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contribution.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {getTypeLabel(contribution.type)}
                      </span>
                      <span className="text-xs text-muted-foreground/70">
                        {formatDistanceToNow(new Date(contribution.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Show More / Show Less button */}
            {hasMoreThanInitial && !isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-muted-foreground"
                onClick={() => {
                  setIsExpanded(true);
                  setCurrentPage(1);
                }}
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                {t('common.showMore', 'Show more')} ({totalCount - INITIAL_DISPLAY_COUNT})
              </Button>
            )}

            {isExpanded && (
              <>
                {/* Pagination controls */}
                {needsPagination && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground px-2">
                      {t('common.pageOf', 'Page {{current}} of {{total}}', { 
                        current: currentPage, 
                        total: totalPages 
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Collapse button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-muted-foreground"
                  onClick={() => {
                    setIsExpanded(false);
                    setCurrentPage(1);
                  }}
                >
                  <ChevronUp className="h-4 w-4 mr-1" />
                  {t('common.showLess', 'Show less')}
                </Button>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
