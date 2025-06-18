
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
  return (
    <Link to={`/news/${news.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {news.title}
          </CardTitle>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(news.date_posted), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {news.location}
            </div>
            <div className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              {news.source}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 line-clamp-3">
            {news.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
