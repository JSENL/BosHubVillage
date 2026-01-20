import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, MapPin, Loader2, ExternalLink } from 'lucide-react';
import { useNewsLinkedContent } from '@/hooks/useNewsLinkedContent';
import { format } from 'date-fns';

interface LinkedContentSectionProps {
  newsId: string;
}

export const LinkedContentSection = ({ newsId }: LinkedContentSectionProps) => {
  const { t } = useTranslation();
  const { linkedContent, isLoading } = useNewsLinkedContent(newsId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (linkedContent.length === 0) {
    return null;
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'business':
        return <Building2 className="h-4 w-4 text-primary" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-primary" />;
      case 'local_service':
        return <MapPin className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  const getContentLink = (item: typeof linkedContent[0]) => {
    switch (item.content_type) {
      case 'business':
        return `/business/${item.content_id}`;
      case 'event':
        return `/event/${item.content_id}`;
      case 'local_service':
        return `/local-service/${item.content_id}`;
      default:
        return '#';
    }
  };

  const getContentTitle = (item: typeof linkedContent[0]) => {
    switch (item.content_type) {
      case 'business':
        return item.business?.title || 'Unknown Business';
      case 'event':
        return item.event?.title || 'Unknown Event';
      case 'local_service':
        return item.local_resource?.name || 'Unknown Service';
      default:
        return 'Unknown';
    }
  };

  const getContentSubtitle = (item: typeof linkedContent[0]) => {
    switch (item.content_type) {
      case 'business':
        return item.business?.business_type;
      case 'event':
        return item.event?.date ? format(new Date(item.event.date), 'MMM d, yyyy') : item.event?.category;
      case 'local_service':
        return item.local_resource?.category;
      default:
        return '';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'business':
        return t('content.business', 'Business');
      case 'event':
        return t('content.event', 'Event');
      case 'local_service':
        return t('content.localService', 'Local Service');
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          {t('content.relatedContent', 'Related Content')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {linkedContent.map((item) => (
            <Link
              key={item.id}
              to={getContentLink(item)}
              className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {getContentIcon(item.content_type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {getContentTitle(item)}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getTypeLabel(item.content_type)}
                    </Badge>
                    {getContentSubtitle(item) && (
                      <span className="text-xs text-muted-foreground">
                        {getContentSubtitle(item)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
