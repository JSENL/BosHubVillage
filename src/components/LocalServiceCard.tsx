
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building } from 'lucide-react';
import { LocalResource } from '@/types/localServices';
import { useNavigate } from 'react-router-dom';

interface LocalServiceCardProps {
  localService: LocalResource;
}

const LocalServiceCard = ({ localService }: LocalServiceCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const handleClick = () => {
    navigate(`/local-resource/${localService.id}`);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer min-h-[200px]" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
            {localService.name}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0 text-xs">
            <Building className="h-3 w-3 mr-1" />
            {localService.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-2">
        <div className="flex items-start text-gray-600">
          <MapPin className="h-3 w-3 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-xs">
            <p className="truncate">{localService.address}</p>
            <p className="text-xs text-gray-500">
              {localService.neighborhood}
              {localService.village && `, ${localService.village}`}
            </p>
          </div>
        </div>
        
        {localService.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {localService.description}
          </p>
        )}
        
        <div className="pt-1 border-t">
          <p className="text-xs text-gray-500">
            Added {formatDate(localService.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalServiceCard;
