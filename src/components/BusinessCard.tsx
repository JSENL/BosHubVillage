import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { Business } from '@/types/business';
import { Link } from 'react-router-dom';
import { TranslatedText } from '@/components/common/TranslatedText';
import { CategoryIcon, CategoryHero } from '@/components/common/CategoryIcon';
import SponsoredBadge from '@/components/common/SponsoredBadge';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  const { t } = useTranslation();
  
  // Generate random rating for visual appeal
  const rating = Math.floor(Math.random() * 2) + 4;
  const reviewCount = Math.floor(Math.random() * 200) + 20;

  return (
    <Link to={`/business/${business.id}`}>
      <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer h-full overflow-hidden group ${business.is_sponsored ? 'ring-2 ring-amber-400/50' : ''}`}>
        {/* Category Hero */}
        <CategoryHero 
          category={business.business_type} 
          type="business"
          height="h-20"
        />
        
        <CardHeader className="pb-1 pt-3 px-3">
          {business.is_sponsored && (
            <div className="mb-2">
              <SponsoredBadge />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold line-clamp-2 break-words group-hover:text-primary transition-colors">
                <TranslatedText text={business.title} />
              </CardTitle>
              <div className="flex items-center space-x-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < rating ? 'text-secondary fill-current' : 'text-muted'}`} 
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{reviewCount}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                <CategoryIcon category={business.business_type} type="business" size="sm" className="mr-1" />
                <span className="truncate">{business.business_type}</span>
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground mt-2 min-w-0">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-primary" />
            <span className="text-xs truncate min-w-0 break-all">{business.address}, {business.neighborhood}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-1 px-3 pb-3">
          {business.short_description && (
            <p className="text-muted-foreground line-clamp-1 mb-1 text-xs break-words">
              <TranslatedText text={business.short_description} />
            </p>
          )}
          <p className="text-muted-foreground line-clamp-2 text-xs break-words">
            <TranslatedText text={business.description} />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;
