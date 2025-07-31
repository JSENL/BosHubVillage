import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building } from 'lucide-react';
import { Business } from '@/types/business';
import { Link } from 'react-router-dom';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <Link to={`/business/${business.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full min-h-[200px]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-semibold line-clamp-2">
                {business.title}
              </CardTitle>
              <Badge variant="secondary" className="mb-2 text-xs">
                <Building className="h-3 w-3 mr-1" />
                {business.business_type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="text-xs truncate">{business.address}, {business.neighborhood}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {business.short_description && (
            <p className="text-gray-700 line-clamp-1 mb-1 text-xs">
              {business.short_description}
            </p>
          )}
          <p className="text-gray-700 line-clamp-2 text-xs">
            {business.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;