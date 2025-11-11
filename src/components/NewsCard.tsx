import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { News } from '@/types/news';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

interface NewsCardProps {
  news: News;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const { t } = useTranslation();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <Link to={`/news/${news.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-1 pt-3 px-3">
          <CardTitle className="text-base font-semibold line-clamp-2 break-words">
            {news.title}
          </CardTitle>
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <div className="flex items-center min-w-0">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{formatDate(news.date_posted)}</span>
            </div>
            <div className="flex items-center min-w-0">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate break-all min-w-0">{news.location}</span>
            </div>
            <div className="flex items-center min-w-0">
              <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{news.source}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-1 px-3 pb-3">
          <p className="text-gray-700 line-clamp-2 text-xs break-words">
            {news.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;