
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTranslation } from 'react-i18next';

interface UseMapInitializerProps {
  mapboxToken: string | null;
  isLoadingApiKey: boolean;
}

export const useMapInitializer = ({ mapboxToken, isLoadingApiKey }: UseMapInitializerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Clean up any existing map first
    if (mapInstanceRef.current) {
      console.log('🧹 Cleaning up existing map before re-initialization...');
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      setMapInstance(null);
    }

    if (!mapRef.current || !mapboxToken || isLoadingApiKey) {
      console.log('⏳ Map initialization skipped:', { 
        hasMapRef: !!mapRef.current, 
        hasToken: !!mapboxToken, 
        isLoading: isLoadingApiKey 
      });
      setMapInstance(null);
      return;
    }

    console.log('🚀 Initializing Mapbox map...');
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-71.09, 42.29], // Southern Boston (Mattapan, Roxbury, Hyde Park, Dorchester, Jamaica Plain)
      zoom: 12,
      scrollZoom: true, // Enable scroll zoom
      doubleClickZoom: false, // Disable double-click zoom to prevent interference
      touchZoomRotate: true, // Enable touch zoom on mobile
      dragPan: true, // Enable panning
      keyboard: true, // Enable keyboard navigation
      preserveDrawingBuffer: true, // Better performance
      antialias: true, // Smoother rendering
      fitBoundsOptions: {
        padding: 20
      }
    });

    // Add navigation controls
    const navigationControl = new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true
    });
    
    map.addControl(navigationControl, 'top-right');

    // Add fullscreen control
    map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

    // Custom double-click zoom handler for empty map areas (not markers)
    map.on('dblclick', (e) => {
      try {
        // Check if the double-click happened on a marker element
        const clickedElement = e.originalEvent?.target as HTMLElement;
        
        if (!clickedElement) {
          console.log('🔍 No target element found, zooming anyway');
          performZoom();
          return;
        }
        
        // Check if we clicked on a marker or its child elements
        const isMarkerClick = clickedElement.classList?.contains('marker') || 
                             clickedElement.closest?.('.marker') !== null;
        
        if (!isMarkerClick) {
          performZoom();
        } else {
          console.log('🎯 Double-clicked on marker, skipping zoom');
        }
        
        function performZoom() {
          const currentZoom = map.getZoom();
          const maxZoom = map.getMaxZoom();
          const newZoom = Math.min(currentZoom + 1, maxZoom);
          
          map.easeTo({
            center: e.lngLat,
            zoom: newZoom,
            duration: 300
          });
          
          console.log(`🔍 Map double-clicked: zooming from ${currentZoom.toFixed(1)} to ${newZoom.toFixed(1)}`);
        }
        
      } catch (error) {
        console.error('❌ Error in double-click handler:', error);
        // Fallback: just zoom in without checking for markers
        const currentZoom = map.getZoom();
        const newZoom = Math.min(currentZoom + 1, map.getMaxZoom());
        map.easeTo({
          center: e.lngLat,
          zoom: newZoom,
          duration: 300
        });
      }
    });

    map.on('load', () => {
      console.log('✅ Mapbox map loaded successfully');
      // Force resize to ensure proper fitting
      setTimeout(() => {
        map.resize();
        console.log('🔄 Map resized after load');
      }, 100);
    });

    map.on('error', (e) => {
      console.error('❌ Mapbox map error:', e);
    });

    // Listen for container resize events
    const handleContainerResize = () => {
      if (map && !map._removed) {
        console.log('🔄 Resizing map due to container change...');
        map.resize();
      }
    };

    window.addEventListener('mapContainerResized', handleContainerResize);

    mapInstanceRef.current = map;
    setMapInstance(map); // This will trigger re-renders in components using this hook

    return () => {
      console.log('🧹 Cleaning up Mapbox map...');
      window.removeEventListener('mapContainerResized', handleContainerResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapInstance(null);
      }
    };
  }, [mapboxToken, isLoadingApiKey]);

  return {
    mapRef,
    mapInstance // This now comes from state, so it will trigger re-renders
  };
};
