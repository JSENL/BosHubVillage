
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
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {business.title}
            </CardTitle>
            <Badge variant="secondary" className="ml-2">
              <Building className="h-3 w-3 mr-1" />
              {business.business_type}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {business.address}, {business.neighborhood}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 line-clamp-3">
            {business.short_description || business.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;
