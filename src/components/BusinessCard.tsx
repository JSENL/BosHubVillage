import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building } from 'lucide-react';
import { Business } from '@/types/business';
import { Link } from 'react-router-dom';
import { TranslatedText } from '@/components/common/TranslatedText';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  const { t } = useTranslation();
  return (
    <Link to={`/business/${business.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full min-h-[200px]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold line-clamp-2 break-words">
                <TranslatedText text={business.title} />
              </CardTitle>
              <Badge variant="secondary" className="mb-2 text-xs">
                <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{business.business_type}</span>
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-1 min-w-0">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="text-xs truncate min-w-0 break-all">{business.address}, {business.neighborhood}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {business.short_description && (
            <p className="text-gray-700 line-clamp-1 mb-1 text-xs break-words">
              <TranslatedText text={business.short_description} />
            </p>
          )}
          <p className="text-gray-700 line-clamp-2 text-xs break-words">
            <TranslatedText text={business.description} />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;