
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

      // Get marker color based on item type
      const getMarkerColor = (type: string) => {
        switch (type) {
          case 'event': return '#ef4444'; // Red
          case 'local-service': return '#eab308'; // Yellow  
          case 'business': return '#3b82f6'; // Blue
          case 'news': return '#10b981'; // Green (keeping this for news)
          default: return '#6b7280'; // Gray
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
      
      // Check if permanently closed
      const isPermanentlyClosed = item.originalData?.permanently_closed;
      
      if (isPermanentlyClosed) {
        // Create permanently closed text
        const closedText = document.createElement('div');
        closedText.textContent = 'PERMANENTLY CLOSED';
        closedText.style.position = 'absolute';
        closedText.style.top = '-20px';
        closedText.style.left = '50%';
        closedText.style.transform = 'translateX(-50%)';
        closedText.style.fontSize = '8px';
        closedText.style.fontWeight = 'bold';
        closedText.style.color = 'red';
        closedText.style.backgroundColor = 'white';
        closedText.style.padding = '1px 3px';
        closedText.style.borderRadius = '2px';
        closedText.style.whiteSpace = 'nowrap';
        closedText.style.border = '1px solid red';
        closedText.style.zIndex = '1000';
        el.appendChild(closedText);
        
        // Make marker semi-transparent for closed businesses
        el.style.opacity = '0.7';
      }
      
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

      // Create marker without popup for now (sidebar will handle display)
      const marker = new mapboxgl.Marker(el)
        .setLngLat([coords.lng, coords.lat])
        .addTo(map);

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
