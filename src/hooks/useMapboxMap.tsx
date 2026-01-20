
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';

interface UseMapboxMapProps {
  mapboxToken?: string | null;
  isLoadingApiKey?: boolean;
}

export const useMapboxMap = ({ mapboxToken, isLoadingApiKey }: UseMapboxMapProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapboxKey, setMapboxKey] = useState<string | null>(mapboxToken || null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;
      
      try {
        // If no token provided, fetch from Supabase
        if (!mapboxKey) {
          const { data, error } = await supabase.functions.invoke('get-mapbox-key');
          
          if (error) {
            console.error('Error fetching Mapbox key:', error);
            setError('Failed to load map configuration');
            setIsLoading(false);
            return;
          }
          
          if (!data?.mapboxKey) {
            setError('Mapbox key not configured');
            setIsLoading(false);
            return;
          }
          
          setMapboxKey(data.mapboxKey);
          mapboxgl.accessToken = data.mapboxKey;
        } else {
          mapboxgl.accessToken = mapboxKey;
        }

        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-71.09, 42.29], // Southern Boston (Mattapan, Roxbury, Hyde Park, Dorchester, Jamaica Plain)
          zoom: 12
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        mapInstanceRef.current = map;
        setIsLoading(false);

        return () => {
          map.remove();
        };
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    if (!isLoadingApiKey && mapRef.current) {
      initializeMap();
    }
  }, [mapboxKey, isLoadingApiKey]);

  return {
    mapRef,
    mapInstance: mapInstanceRef.current,
    isLoading,
    error
  };
};
