
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates, createPopupContent } from '@/utils/mapMarkerUtils';
import { createMarkerElement } from '@/utils/mapMarkerCreator';

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
  const hasFitBoundsRef = useRef(false); // Track if we've already fit bounds initially

  useEffect(() => {
    console.log('🎯 useMapMarkers called with:', {
      hasMap: !!map,
      itemsCount: items?.length || 0,
      mapReady: map && map.loaded && map.loaded(),
    });

    if (!map) {
      console.log('🗺️ MapMarkers: No map instance available');
      return;
    }

    if (!items || items.length === 0) {
      console.log('🗺️ MapMarkers: No items available');
      return;
    }

    console.log('🎯 Creating DOM markers for items:', items.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create markers for each item
    items.forEach((item, index) => {
      console.log(`🎯 Processing item ${index + 1}/${items.length}:`, {
        title: item.title,
        type: item.type,
        lat: item.latitude,
        lng: item.longitude,
        hasCoords: !!(item.latitude && item.longitude)
      });

      const coords = validateCoordinates(item);
      if (!coords) {
        console.log('❌ Invalid coordinates for item:', item.title);
        return;
      }

      console.log('✅ Valid coordinates for item:', item.title, coords);
      console.log('🔍 Checking if sponsored:', item.title, 'is_sponsored:', (item as any).is_sponsored);

      // Use the enhanced marker element with sponsored effects
      const el = createMarkerElement(item);

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

      console.log('🎯 Added marker for:', item.title, 'at', [coords.lng, coords.lat]);
      markersRef.current.push(marker);
    });

    console.log(`✅ Created ${markersRef.current.length} DOM markers`);

    // Only fit map bounds on initial load, not when user has already interacted with the map
    if (markersRef.current.length > 0 && !hasFitBoundsRef.current) {
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
          
          hasFitBoundsRef.current = true; // Mark that we've fit bounds initially
          console.log(`🗺️ Map bounds fitted to ${coordinates.length} valid coordinates (initial load)`);
        }
      } catch (error) {
        console.warn('Error fitting map bounds:', error);
      }
    } else if (markersRef.current.length > 0) {
      console.log(`🗺️ Skipping fitBounds - user has control of zoom level`);
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);
};
