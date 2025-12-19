import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2, X } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Badge } from '@/components/ui/badge';

interface NearMeFilterProps {
  maxDistance: number | null;
  onMaxDistanceChange: (distance: number | null) => void;
  userLocation: { latitude: number; longitude: number } | null;
  onLocationRequest: () => Promise<{ latitude: number; longitude: number } | null>;
  onClearLocation: () => void;
  isLoading: boolean;
}

export const NearMeFilter = ({
  maxDistance,
  onMaxDistanceChange,
  userLocation,
  onLocationRequest,
  onClearLocation,
  isLoading,
}: NearMeFilterProps) => {
  const handleNearMeClick = async () => {
    if (userLocation) {
      // Already have location, just toggle the filter
      if (maxDistance) {
        onMaxDistanceChange(null);
      } else {
        onMaxDistanceChange(10); // Default 10km
      }
    } else {
      // Request location first
      const location = await onLocationRequest();
      if (location) {
        onMaxDistanceChange(10); // Default 10km
      }
    }
  };

  const distanceOptions = [
    { value: '1', label: '1 km' },
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '25', label: '25 km' },
    { value: '50', label: '50 km' },
  ];

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={maxDistance ? "default" : "outline"}
        size="sm"
        onClick={handleNearMeClick}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        Near Me
      </Button>

      {userLocation && maxDistance && (
        <>
          <Select
            value={maxDistance.toString()}
            onValueChange={(value) => onMaxDistanceChange(parseInt(value))}
          >
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {distanceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onMaxDistanceChange(null);
              onClearLocation();
            }}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}

      {userLocation && !maxDistance && (
        <Badge variant="outline" className="text-xs">
          Location available
        </Badge>
      )}
    </div>
  );
};
