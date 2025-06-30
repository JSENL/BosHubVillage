
import { useState, useCallback } from 'react';
import { useMapLoader } from './useMapLoader';
import { toast } from 'sonner';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

const geocodeAddressMapbox = async (address: string, apiKey: string): Promise<GeocodeResult | null> => {
  if (!address || !apiKey) {
    console.error('Address or API key missing for geocoding');
    return null;
  }

  try {
    console.log('Geocoding address with Mapbox:', address);
    
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [longitude, latitude] = feature.center;
      
      console.log('Mapbox geocoding successful:', { latitude, longitude });
      
      return {
        latitude,
        longitude,
        formatted_address: feature.place_name
      };
    } else {
      console.error('Mapbox geocoding failed: No results found');
      return null;
    }
  } catch (error) {
    console.error('Error during Mapbox geocoding:', error);
    return null;
  }
};

export const useGeocoding = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { apiKey } = useMapLoader();

  const geocode = useCallback(async (address: string): Promise<GeocodeResult | null> => {
    if (!apiKey) {
      console.error('Mapbox API key not available');
      toast.error('Mapbox API not configured');
      return null;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddressMapbox(address, apiKey);
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
