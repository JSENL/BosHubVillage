
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates, createPopupContent } from '@/utils/mapMarkerUtils';

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

    console.log('🎯 Creating DOM markers for items:', items.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create markers for each item
    items.forEach(item => {
      const coords = validateCoordinates(item);
      if (!coords) return;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png)';
      el.style.backgroundSize = 'cover';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';

      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('📍 Marker clicked:', item.title);
        console.log('📍 Marker clicked:', item.title, 'ID:', item.id);
        if (onMarkerClick) {
          onMarkerClick(item);
        }
      });

      // Add double-click handler
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (onMarkerDoubleClick) {
          onMarkerDoubleClick(item);
        }
      });

      // Create marker without popup for now (sidebar will handle display)
      const marker = new mapboxgl.Marker(el)
        .setLngLat([coords.lng, coords.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    console.log(`✅ Created ${markersRef.current.length} DOM markers`);

    // Fit map bounds if we have valid markers
    if (markersRef.current.length > 0) {
      try {
        const coordinates = items
          .map(item => {
            const coords = validateCoordinates(item);
            return coords ? [coords.lng, coords.lat] : null;
          })
          .filter(coord => coord !== null) as [number, number][];
        
        if (coordinates.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          coordinates.forEach(coord => bounds.extend(coord));
          
          map.fitBounds(bounds, {
            padding: { top: 60, bottom: 60, left: 60, right: 60 },
            maxZoom: 14
          });
          console.log(`🗺️ Map bounds fitted to ${coordinates.length} valid coordinates`);
        }
      } catch (error) {
        console.warn('Error fitting map bounds:', error);
      }
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);
};
