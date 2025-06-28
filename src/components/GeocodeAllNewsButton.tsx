
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGeocoding } from '@/hooks/useGeocoding';
import { geocodeAllNews } from '@/utils/geocodeAllNews';
import { MapPin, Loader2 } from 'lucide-react';

export const GeocodeAllNewsButton = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { geocode, isReady } = useGeocoding();

  const handleGeocodeAll = async () => {
    if (!isReady) {
      console.error('Geocoding service not ready');
      return;
    }

    setIsGeocoding(true);
    try {
      await geocodeAllNews(geocode);
    } catch (error) {
      console.error('Error geocoding all news:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <Button
      onClick={handleGeocodeAll}
      disabled={isGeocoding || !isReady}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isGeocoding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
      {isGeocoding ? 'Geocoding...' : 'Geocode All News'}
    </Button>
  );
};
