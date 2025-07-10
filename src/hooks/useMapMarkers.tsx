
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { createMapboxMarker } from '@/utils/mapMarkerCreator';

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
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (error) {
        console.warn('Error removing marker:', error);
      }
    });
    markersRef.current = [];

    // Create new markers
    const newMarkers: mapboxgl.Marker[] = [];
    let validMarkersCount = 0;
    let invalidCoordinatesCount = 0;
    
    items.forEach((item) => {
      try {
        const marker = createMapboxMarker(item, map, onMarkerClick, onMarkerDoubleClick);
        if (marker) {
          newMarkers.push(marker);
          validMarkersCount++;
          console.log(`✅ Created marker ${validMarkersCount}: "${item.title}" (${item.type})`);
        } else {
          invalidCoordinatesCount++;
        }
      } catch (error) {
        console.error(`❌ Error creating marker for ${item.type} "${item.title}":`, error);
        invalidCoordinatesCount++;
      }
    });

    markersRef.current = newMarkers;
    
    console.log(`🎯 Marker creation summary:`, {
      totalItems: items.length,
      validMarkers: validMarkersCount,
      invalidCoordinates: invalidCoordinatesCount,
      successRate: `${((validMarkersCount / items.length) * 100).toFixed(1)}%`
    });

    // Fit map bounds if we have valid markers
    if (newMarkers.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        let boundsCount = 0;
        
        items.forEach(item => {
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            bounds.extend([lng, lat]);
            boundsCount++;
          }
        });
        
        if (boundsCount > 0) {
          map.fitBounds(bounds, { 
            padding: { top: 60, bottom: 60, left: 60, right: 60 },
            maxZoom: 14
          });
          console.log(`🗺️ Map bounds fitted to ${boundsCount} valid coordinates`);
        }
      } catch (error) {
        console.warn('Error fitting map bounds:', error);
      }
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.warn('Error cleaning up marker:', error);
        }
      });
      markersRef.current = [];
    };
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);

  return markersRef.current;
};
