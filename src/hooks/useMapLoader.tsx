
import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export const useMapLoader = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  // Get Mapbox token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('mapbox_token') || '';
    setMapboxToken(token);
    setIsLoadingToken(false);
    
    if (token && token !== 'pk.your_mapbox_token_here') {
      setMapLoaded(true);
    }
  }, []);

  const loadMap = async (mapRef: React.RefObject<HTMLDivElement>) => {
    if (!mapboxToken || !mapRef.current || mapboxToken === 'pk.your_mapbox_token_here') {
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

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      setMapLoaded(true);
      console.log('Mapbox loaded successfully');
      return map;
    } catch (error) {
      console.error('Error loading Mapbox:', error);
      return null;
    }
  };

  return {
    apiKey: mapboxToken, // Keep this for backward compatibility
    mapLoaded,
    isLoadingApiKey: isLoadingToken,
    loadMap
  };
};
