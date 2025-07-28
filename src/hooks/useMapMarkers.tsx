import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { createMarkerElement, addMarkerEvents } from '@/utils/markerHelpers';
import { validateCoordinates } from '@/utils/mapMarkerUtils';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  items: UnifiedItem[];
  onMarkerClick?: (item: UnifiedItem) => void;
  onMarkerDoubleClick?: (item: UnifiedItem) => void;
}

export const useMapMarkers = ({
  map,
  items,
  onMarkerClick,
  onMarkerDoubleClick
}: UseMapMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map || !items || items.length === 0) {
      console.log('🗺️ MapMarkers: No map or items available');
      return;
    }

    console.log('🎯 Creating markers for items:', items.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create new markers
    items.forEach(item => {
      const coords = validateCoordinates(item);
      if (!coords) return;

      // Create custom marker element
      const markerElement = createMarkerElement(item);
      
      // Create mapbox marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([coords.lng, coords.lat])
        .addTo(map);

      // Add event listeners
      addMarkerEvents(markerElement, item, onMarkerClick, onMarkerDoubleClick);

      markersRef.current.push(marker);
    });

    console.log(`✅ Created ${markersRef.current.length} markers`);

    // Fit map bounds if we have markers
    if (markersRef.current.length > 0) {
      const coordinates = items
        .map(item => validateCoordinates(item))
        .filter(coords => coords !== null)
        .map(coords => [coords!.lng, coords!.lat]);

      if (coordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord as [number, number]));
        
        map.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          maxZoom: 14
        });
      }
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);
};