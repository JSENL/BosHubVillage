
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGeocoding } from '@/hooks/useGeocoding';
import { uselocalresources } from '@/hooks/uselocalresources';
import { geocodelocalresources } from '@/utils/geocodelocalresources';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const GeocodeAllLocalResourcesButton = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { geocode, isReady } = useGeocoding();
  const { data: localResources, refetch } = uselocalresources();

  const handleGeocodeAll = async () => {
    if (!isReady) {
      toast.error('Geocoding service is not ready');
      return;
    }

    if (!localResources || localResources.length === 0) {
      toast.error('No local resources to geocode');
      return;
    }

    const resourcesNeedingGeocode = localResources.filter(resource => 
      (!resource.latitude || !resource.longitude) && resource.address
    );

    if (resourcesNeedingGeocode.length === 0) {
      toast.info('All local resources already have coordinates');
      return;
    }

    setIsGeocoding(true);
    try {
      await geocodelocalresources(resourcesNeedingGeocode, geocode);
      toast.success(`Successfully geocoded ${resourcesNeedingGeocode.length} local resources`);
      refetch();
    } catch (error: any) {
      console.error('Error geocoding local resources:', error);
      toast.error(`Failed to geocode local resources: ${error.message}`);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <Button 
      onClick={handleGeocodeAll}
      disabled={isGeocoding || !isReady}
      variant="outline"
      size="sm"
    >
      {isGeocoding ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4 mr-2" />
      )}
      {isGeocoding ? 'Geocoding...' : 'Geocode All'}
    </Button>
  );
};

// Backward-compatible export for legacy import names.
export const GeocodeAlllocalresourcesButton = GeocodeAllLocalResourcesButton;
