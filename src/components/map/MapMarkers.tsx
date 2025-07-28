import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates } from '@/utils/mapMarkerUtils';
import { createMarkerElement, addMarkerEventListeners } from '@/utils/mapbox/markerFactory';
import { createPopup } from '@/utils/mapbox/popupFactory';
import { fitMapToItems } from '@/utils/mapbox/mapUtils';

interface MapMarkersProps {
  map: mapboxgl.Map | null;
  items: UnifiedItem[];
  onMarkerClick?: (item: UnifiedItem) => void;
  onMarkerDoubleClick?: (item: UnifiedItem) => void;
}

export const MapMarkers = ({
  map,
  items,
  onMarkerClick,
  onMarkerDoubleClick
}: MapMarkersProps) => {
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

      // Handle single click - show popup
      const handleSingleClick = (clickedItem: UnifiedItem) => {
        const popup = createPopup(clickedItem);
        popup.addTo(map);
        
        if (onMarkerClick) {
          onMarkerClick(clickedItem);
        }
      };

      // Add event listeners
      addMarkerEventListeners(
        markerElement, 
        item, 
        handleSingleClick, 
        onMarkerDoubleClick
      );

      markersRef.current.push(marker);
    });

    console.log(`✅ Created ${markersRef.current.length} markers`);

    // Fit map bounds if we have markers
    if (markersRef.current.length > 0) {
      fitMapToItems(map, items);
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);

  return null; // This component doesn't render anything
};