import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { LocalResource } from '@/types/localServices';
import { useNavigate } from 'react-router-dom';
import { TranslatedText } from '@/components/common/TranslatedText';
import { CategoryIcon, CategoryHero } from '@/components/common/CategoryIcon';

interface LocalServiceCardProps {
  localService: LocalResource;
}

const LocalServiceCard = ({ localService }: LocalServiceCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Generate random rating for visual appeal
  const rating = Math.floor(Math.random() * 2) + 4;
  const reviewCount = Math.floor(Math.random() * 150) + 10;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const handleClick = () => {
    navigate(`/local-resource/${localService.id}`);
  };

  return (
    <Card 
      className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group" 
      onClick={handleClick}
    >
      {/* Category Hero */}
      <CategoryHero 
        category={localService.category} 
        type="local-service"
        height="h-20"
      />
      
      <CardHeader className="pb-1 pt-3 px-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-2 break-words flex-1 min-w-0 mr-2 group-hover:text-primary transition-colors">
            <TranslatedText text={localService.name} />
          </CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0 text-xs">
            <CategoryIcon category={localService.category} type="local-service" size="sm" className="mr-1" />
            <span className="truncate max-w-20">{localService.category}</span>
          </Badge>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < rating ? 'text-secondary fill-current' : 'text-muted'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{reviewCount}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-1 px-3 pb-3">
        <div className="flex items-start text-muted-foreground min-w-0">
          <MapPin className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0 text-primary" />
          <div className="text-xs min-w-0 flex-1">
            <p className="truncate break-all">{localService.address}</p>
            <p className="text-xs text-muted-foreground/70 truncate">
              {localService.neighborhood}
              {localService.village && `, ${localService.village}`}
            </p>
          </div>
        </div>
        
        {localService.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 break-words">
            <TranslatedText text={localService.description} />
          </p>
        )}
        
        <div className="pt-1 border-t border-border">
          <p className="text-xs text-muted-foreground/70">
            {t('cards.added')} {formatDate(localService.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalServiceCard;
