
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { News } from '@/types/news';
import { format } from 'date-fns';

interface FeaturedArticleProps {
  article: News;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  return (
    <Link to={`/news/${article.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(article.date_posted), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {article.location}
            </div>
            <div className="flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              {article.source}
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-serif font-bold leading-tight hover:text-red-600 transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {article.image_url && (
            <div className="mb-4 overflow-hidden rounded-lg">
              <img 
                src={article.image_url} 
                alt={article.title} 
                className="w-full max-h-72 object-cover"
              />
            </div>
          )}
          <p className="text-gray-700 text-lg leading-relaxed line-clamp-4">
            {article.content}
          </p>
          {article.villages && Array.isArray(article.villages) && (
            <div className="flex flex-wrap gap-1 mt-4">
              {article.villages.map((village: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {village}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedArticle;
