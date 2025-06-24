
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building } from 'lucide-react';
import { Business } from '@/types/business';
import { BusinessSubmission } from '@/types/submissions';
import { Link } from 'react-router-dom';

interface BusinessCardProps {
  business: Business | BusinessSubmission;
}

const BusinessCard = ({ business }: BusinessCardProps) => {
  return (
    <Link to={`/business/${business.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {business.title}
              </CardTitle>
              <Badge variant="secondary" className="mb-2">
                <Building className="h-3 w-3 mr-1" />
                {business.business_type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {business.address}, {business.neighborhood}
          </div>
        </CardHeader>
        <CardContent>
          {business.short_description && (
            <p className="text-gray-700 line-clamp-2 mb-2">
              {business.short_description}
            </p>
          )}
          <p className="text-gray-700 line-clamp-3">
            {business.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusinessCard;
