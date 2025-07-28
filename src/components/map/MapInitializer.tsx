
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
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-71.0589, 42.3601], // Boston center
      zoom: 12,
      scrollZoom: true, // Enable scroll zoom
      doubleClickZoom: false, // Disable double-click zoom to prevent interference
      touchZoomRotate: true, // Enable touch zoom on mobile
      dragPan: true, // Enable panning
      keyboard: true // Enable keyboard navigation
    });

    // Add navigation controls (zoom in/out, compass)
    map.addControl(new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    }), 'top-right');

    // Add fullscreen control
    map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

    // Custom double-click zoom handler for empty map areas (not markers)
    map.on('dblclick', (e) => {
      // Check if the double-click happened on a marker element
      const clickedElement = e.originalEvent.target as HTMLElement;
      const isMarkerClick = clickedElement.closest('.marker');
      
      if (!isMarkerClick) {
        // Only zoom if we didn't click on a marker
        const currentZoom = map.getZoom();
        const newZoom = Math.min(currentZoom + 1, map.getMaxZoom());
        
        map.easeTo({
          center: e.lngLat,
          zoom: newZoom,
          duration: 300
        });
        
        console.log(`🔍 Map double-clicked: zooming from ${currentZoom.toFixed(1)} to ${newZoom.toFixed(1)}`);
      }
    });

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
