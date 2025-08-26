
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { createPopupContent } from '@/utils/mapPopupContent';
import { useMapTranslations } from '@/hooks/useMapTranslations';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  items: UnifiedItem[];
  onMarkerClick?: (item: UnifiedItem) => void;
}

export const useMapMarkers = ({
  map,
  items,
  onMarkerClick
}: UseMapMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { getTranslatedMapData, isTranslationEnabled } = useMapTranslations();

  useEffect(() => {
    if (!map) {
      console.log('🗺️ MapMarkers: No map available');
      return;
    }

    if (!items || items.length === 0) {
      console.log('🗺️ MapMarkers: No items to display');
      // Clear any existing markers when no items
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.warn('Error removing marker:', error);
        }
      });
      markersRef.current = [];
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
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);

        // Validate coordinates
        if (!item.latitude || !item.longitude || isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
          console.warn(`Invalid coordinates for item ${item.id} "${item.title}":`, {
            rawLat: item.latitude,
            rawLng: item.longitude,
            convertedLat: lat,
            convertedLng: lng
          });
          invalidCoordinatesCount++;
          return;
        }

        // Additional validation for reasonable coordinate ranges
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn(`Coordinates out of range for item ${item.id} "${item.title}":`, { lat, lng });
          invalidCoordinatesCount++;
          return;
        }

        // Determine marker color based on type
        const getMarkerColor = (type: string): string => {
          switch (type) {
            case 'event': return 'hsl(5, 75%, 55%)'; // Warm red from logo
            case 'news': return 'hsl(135, 65%, 45%)'; // Forest green from logo
            case 'business': return 'hsl(210, 75%, 45%)'; // Vibrant blue from logo
            case 'local-service': return 'hsl(15, 85%, 65%)'; // Coral orange from logo
            default: return 'hsl(220, 15%, 45%)'; // Muted gray
          }
        };

        // Create marker using the standard Mapbox approach
        const marker = new mapboxgl.Marker({
          color: getMarkerColor(item.type)
        })
          .setLngLat([lng, lat])
          .addTo(map);

        // Get translations if enabled
        const translationData = isTranslationEnabled ? getTranslatedMapData(item) : undefined;

        // Create popup instance with enhanced styling
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '340px',
          className: 'custom-popup'
        })
          .setHTML(createPopupContent(item, translationData));

        // Add popup to marker with click event
        marker.setPopup(popup);

        // Add click handler for additional functionality
        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('📍 Marker clicked:', item.title);
          
          if (onMarkerClick) {
            onMarkerClick(item);
          }
        });

        newMarkers.push(marker);
        validMarkersCount++;
        console.log(`✅ Created marker ${validMarkersCount}: "${item.title}" (${item.type})`);

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
  }, [map, items, onMarkerClick]);

  return markersRef.current;
};
