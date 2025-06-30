
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building } from 'lucide-react';
import { LocalResource } from '@/types/localServices';

interface LocalServiceCardProps {
  localService: LocalResource;
}

const LocalServiceCard = ({ localService }: LocalServiceCardProps) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {localService.name}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            <Building className="h-3 w-3 mr-1" />
            {localService.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start text-gray-600">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p>{localService.address}</p>
            <p className="text-xs text-gray-500">
              {localService.neighborhood}
              {localService.village && `, ${localService.village}`}
            </p>
          </div>
        </div>
        
        {localService.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {localService.description}
          </p>
        )}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500">
            Added {new Date(localService.created_at).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalServiceCard;
