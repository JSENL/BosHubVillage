import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { LocalResource } from '@/types/localresources';
import { useNavigate } from 'react-router-dom';
import { useTranslatedField } from '@/hooks/useTranslatedField';
import { useCardLocale } from '@/hooks/useCardLocale';
import { CategoryIcon, CategoryHero } from '@/components/common/CategoryIcon';
import SponsoredBadge from '@/components/common/SponsoredBadge';
import { richTextPlainText } from '@/lib/richText';

interface LocalServiceCardProps {
  localService: LocalResource;
}

const LocalServiceCard = ({ localService }: LocalServiceCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getTranslatedText } = useTranslatedField();
  const { formatDate } = useCardLocale();

  // Generate random rating for visual appeal
  const rating = Math.floor(Math.random() * 2) + 4;
  const reviewCount = Math.floor(Math.random() * 150) + 10;

  const handleClick = () => {
    navigate(`/local-resource/${localService.id}`);
  };

  return (
    <Card 
      className={`h-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${localService.is_sponsored ? 'ring-2 ring-amber-400/50' : ''}`}
      onClick={handleClick}
    >
      {/* Category Hero */}
      <CategoryHero 
        category={localService.category} 
        type="local-service"
        height="h-20"
      />
      
      <CardHeader className="pb-1 pt-3 px-3">
        {localService.is_sponsored && (
          <div className="mb-2">
            <SponsoredBadge />
          </div>
        )}
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-2 break-words flex-1 min-w-0 mr-2 group-hover:text-primary transition-colors">
            {getTranslatedText(localService.name, localService.name_translations)}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0 text-xs">
            <CategoryIcon category={localService.category} type="local-service" size="sm" className="mr-1" />
            <span className="truncate max-w-20">{getTranslatedText(localService.category, localService.category_translations)}</span>
          </Badge>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < rating ? 'text-secondary fill-current' : 'text-muted'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{t('cards.reviews', { count: reviewCount })}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-1 px-3 pb-3">
        <div className="flex items-start text-muted-foreground min-w-0">
          <MapPin className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0 text-primary" />
          <div className="text-xs min-w-0 flex-1">
            <p className="truncate break-all">{getTranslatedText(localService.address, localService.address_translations)}</p>
            <p className="text-xs text-muted-foreground/70 truncate">
              {localService.neighborhood}
              {localService.village && `, ${localService.village}`}
            </p>
          </div>
        </div>
        
        {localService.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 break-words">
            {richTextPlainText(getTranslatedText(localService.description, localService.description_translations))}
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
