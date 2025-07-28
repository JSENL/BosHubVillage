
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapboxMapProps {
  mapboxToken: string | null;
  isLoadingApiKey: boolean;
}

export const useMapboxMap = ({ mapboxToken, isLoadingApiKey }: UseMapboxMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isLoadingApiKey) return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // Changed from light-v11 to streets-v12
      center: [-71.0589, 42.3601], // Boston center
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [mapboxToken, isLoadingApiKey]);

  return {
    mapRef,
    mapInstance: mapInstanceRef.current
  };
};
