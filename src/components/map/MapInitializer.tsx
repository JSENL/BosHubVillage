
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapInitializerProps {
  mapboxToken: string | null;
  isLoadingApiKey: boolean;
}

export const useMapInitializer = ({ mapboxToken, isLoadingApiKey }: UseMapInitializerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isLoadingApiKey) {
      console.log('⏳ Map initialization skipped:', { 
        hasMapRef: !!mapRef.current, 
        hasToken: !!mapboxToken, 
        isLoading: isLoadingApiKey 
      });
      return;
    }

    console.log('🚀 Initializing Mapbox map...');
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Changed from light-v11 to streets-v12
      center: [-71.0589, 42.3601], // Boston center
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      console.log('✅ Mapbox map loaded successfully');
    });

    map.on('error', (e) => {
      console.error('❌ Mapbox map error:', e);
    });

    mapInstanceRef.current = map;

    return () => {
      console.log('🧹 Cleaning up Mapbox map...');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapboxToken, isLoadingApiKey]);

  return {
    mapRef,
    mapInstance: mapInstanceRef.current
  };
};
