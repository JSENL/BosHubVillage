
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Link to={`/news/${news.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold line-clamp-2">
            {news.title}
          </CardTitle>
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(news.date_posted)}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{news.location}</span>
            </div>
            <div className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span className="truncate">{news.source}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-gray-700 line-clamp-2 text-xs">
            {news.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
