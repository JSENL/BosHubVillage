
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
  const hasFitBoundsRef = useRef(false); // Track if we've already fit bounds initially

  useEffect(() => {
    console.log('🎯 useMapMarkers called with:', {
      hasMap: !!map,
      itemsCount: items?.length || 0,
      mapReady: map && map.loaded && map.loaded(),
      mapContainer: map && map.getContainer(),
    });

    if (!map) {
      console.log('🗺️ MapMarkers: No map instance available');
      return;
    }

    // Check if map container exists and is ready
    if (!map.getContainer()) {
      console.log('🗺️ MapMarkers: Map container not ready yet');
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

      // Get marker color based on item type
      const getMarkerColor = (type: string) => {
        switch (type) {
          case 'event': return 'hsl(5, 75%, 55%)'; // Warm red from logo
          case 'local-service': return 'hsl(15, 85%, 65%)'; // Coral orange from logo
          case 'business': return 'hsl(210, 75%, 45%)'; // Vibrant blue from logo
          case 'news': return 'hsl(135, 65%, 45%)'; // Forest green from logo
          default: return 'hsl(220, 15%, 45%)'; // Muted gray
        }
      };

      // Create marker element with custom color
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.backgroundColor = getMarkerColor(item.type);
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '12px';
      el.style.fontWeight = 'bold';
      el.style.color = 'white';
      
      // Add type indicator
      const typeIndicator = item.type.charAt(0).toUpperCase();
      el.textContent = typeIndicator;

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

      // Create marker with safety checks
      try {
        const marker = new mapboxgl.Marker(el)
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);

        console.log('🎯 Added marker for:', item.title, 'at', [coords.lng, coords.lat]);
        markersRef.current.push(marker);
      } catch (error) {
        console.error('❌ Error adding marker for:', item.title, error);
      }
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
