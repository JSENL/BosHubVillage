
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export const useMapLoader = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();

  // Get Mapbox token from Supabase edge function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        console.log('Fetching Mapbox API key from edge function...');
        
        const { data, error } = await supabase.functions.invoke('get-mapbox-key');
        
        if (error) {
          console.error('Error fetching Mapbox API key:', error);
          setError('Failed to fetch Mapbox API key');
          setIsLoadingToken(false);
          return;
        }

        if (data?.apiKey) {
          console.log('Mapbox API key fetched successfully');
          setMapboxToken(data.apiKey);
          setMapLoaded(true);
        } else {
          console.error('No API key returned from edge function');
          setError('No API key configured');
        }
      } catch (err) {
        console.error('Error calling edge function:', err);
        setError('Failed to connect to API service');
      } finally {
        setIsLoadingToken(false);
      }
    };

    fetchMapboxToken();
  }, []);

  const loadMap = async (mapRef: React.RefObject<HTMLDivElement>) => {
    if (!mapboxToken || !mapRef.current) {
      console.log('Cannot load map:', { mapboxToken: !!mapboxToken, mapElement: !!mapRef.current });
      return null;
    }

    console.log('Loading Mapbox with token...');

    try {
      mapboxgl.accessToken = mapboxToken;
      
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-71.0589, 42.3601], // Boston center
        zoom: 12
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      console.log('Mapbox loaded successfully');
      return map;
    } catch (error) {
      console.error('Error loading Mapbox:', error);
      setError('Failed to initialize map');
      return null;
    }
  };

  return {
    apiKey: mapboxToken,
    mapLoaded,
    isLoadingApiKey: isLoadingToken,
    loadMap,
    error
  };
};
