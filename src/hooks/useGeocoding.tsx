
import { useState, useCallback } from 'react';
import { geocodeAddress, GeocodeResult } from '@/utils/geocoding';
import { useMapLoader } from './useMapLoader';
import { toast } from 'sonner';

export const useGeocoding = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { apiKey } = useMapLoader();

  const geocode = useCallback(async (address: string): Promise<GeocodeResult | null> => {
    if (!apiKey) {
      console.error('Google Maps API key not available');
      toast.error('Google Maps API not configured');
      return null;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(address, apiKey);
      if (result) {
        console.log('Successfully geocoded address:', address, result);
        return result;
      } else {
        toast.error('Could not find coordinates for this address');
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to geocode address');
      return null;
    } finally {
      setIsGeocoding(false);
    }
  }, [apiKey]);

  return {
    geocode,
    isGeocoding,
    isReady: !!apiKey
  };
};
