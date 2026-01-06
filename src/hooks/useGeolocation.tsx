import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export interface UseGeolocationReturn {
  location: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<{ latitude: number; longitude: number } | null>;
  clearLocation: () => void;
}

// Haversine formula to calculate distance between two points in km
// Exported as a standalone function for use in filtering
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useGeolocation = (): UseGeolocationReturn => {
  const { toast } = useToast();
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(async (): Promise<{ latitude: number; longitude: number } | null> => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by your browser';
      setState(prev => ({ ...prev, error, loading: false }));
      toast({
        title: "Location unavailable",
        description: error,
        variant: "destructive",
      });
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setState({
            latitude,
            longitude,
            error: null,
            loading: false,
          });
          toast({
            title: "Location found",
            description: "Showing results near you",
          });
          resolve({ latitude, longitude });
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          setState(prev => ({ ...prev, error: errorMessage, loading: false }));
          toast({
            title: "Location error",
            description: errorMessage,
            variant: "destructive",
          });
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    });
  }, [toast]);

  const clearLocation = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
    });
  }, []);

  // Create location object only if both lat/lng are available
  const location = state.latitude !== null && state.longitude !== null 
    ? { latitude: state.latitude, longitude: state.longitude }
    : null;

  return {
    location,
    isLoading: state.loading,
    error: state.error,
    requestLocation,
    clearLocation,
  };
};
