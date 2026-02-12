import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { News } from '@/types/news';
import { Link } from 'react-router-dom';
import { CategoryIcon, CategoryHero } from '@/components/common/CategoryIcon';
import SponsoredBadge from '@/components/common/SponsoredBadge';

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
      <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer h-full overflow-hidden group ${news.is_sponsored ? 'ring-2 ring-amber-400/50' : ''}`}>
        {/* News Hero with image or gradient */}
        {news.image_url ? (
          <div className="h-36 overflow-hidden">
            <img 
              src={news.image_url} 
              alt={news.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <CategoryHero 
            category="news" 
            type="news"
            height="h-20"
          />
        )}
        
        <CardHeader className="pb-1 pt-3 px-3">
          <div className="flex items-start gap-2">
            {news.is_sponsored && <SponsoredBadge />}
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              <CategoryIcon category="news" type="news" size="sm" className="mr-1" />
              News
            </Badge>
          </div>
          <CardTitle className="text-base font-semibold line-clamp-2 break-words mt-2 group-hover:text-primary transition-colors">
            {news.title}
          </CardTitle>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-2">
            <div className="flex items-center min-w-0">
              <Calendar className="h-3 w-3 mr-1 flex-shrink-0 text-primary" />
              <span className="truncate">{formatDate(news.date_posted)}</span>
            </div>
            <div className="flex items-center min-w-0">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-primary" />
              <span className="truncate break-all min-w-0">{news.location}</span>
            </div>
            <div className="flex items-center min-w-0">
              <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0 text-primary" />
              <span className="truncate">{news.source}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-1 px-3 pb-3">
          <p className="text-muted-foreground line-clamp-2 text-xs break-words">
            {news.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;
