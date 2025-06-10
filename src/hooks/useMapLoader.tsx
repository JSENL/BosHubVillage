
import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMapLoader = () => {
  const [apiKey, setApiKey] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);

  // Fetch Google Maps API key from edge function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-maps-key');
        
        if (error) {
          console.error('Error fetching API key:', error);
          toast.error('Failed to load Google Maps API key');
          return;
        }

        if (data?.apiKey) {
          console.log('Google Maps API key fetched successfully');
          setApiKey(data.apiKey);
        } else {
          console.error('No API key returned from edge function');
          toast.error('Google Maps API key not configured');
        }
      } catch (error) {
        console.error('Error calling edge function:', error);
        toast.error('Failed to fetch Google Maps configuration');
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchApiKey();
  }, []);

  const loadMap = async (mapRef: React.RefObject<HTMLDivElement>) => {
    if (!apiKey || !mapRef.current) {
      console.log('Cannot load map:', { apiKey: !!apiKey, mapElement: !!mapRef.current });
      return null;
    }

    console.log('Loading Google Maps with API key...');

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['geometry', 'places']
    });

    try {
      await loader.load();
      
      if (!mapRef.current) {
        console.error('Map container element not found');
        return null;
      }
      
      console.log('Creating map instance...');
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 42.3601, lng: -71.0589 }, // Boston center
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });

      setMapLoaded(true);
      console.log('Google Maps loaded successfully');
      return map;
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      toast.error('Failed to load Google Maps');
      return null;
    }
  };

  return {
    apiKey,
    mapLoaded,
    isLoadingApiKey,
    loadMap
  };
};
