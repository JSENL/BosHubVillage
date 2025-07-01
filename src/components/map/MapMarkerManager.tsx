
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { createPopupContent } from '@/utils/mapPopupContent';

interface MapMarkerManagerProps {
  map: mapboxgl.Map | null;
  items: UnifiedItem[];
  onMarkerClick?: (item: UnifiedItem) => void;
  onMarkerDoubleClick?: (item: UnifiedItem) => void;
}

export const useMapMarkers = ({ map, items, onMarkerClick, onMarkerDoubleClick }: MapMarkerManagerProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const getMarkerColor = (type: string): string => {
    const colors = {
      event: '#dc2626',      // Red
      news: '#2563eb',       // Blue
      business: '#16a34a',   // Green
      'local-service': '#eab308'  // Yellow
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  useEffect(() => {
    if (!map) {
      console.log('Map not ready for markers');
      return;
    }

    console.log('=== MARKER MANAGER UPDATE ===');
    console.log('Map instance:', map);
    console.log('Items to process:', items.length);

    // Clear existing markers
    console.log('Clearing existing markers:', markersRef.current.length);
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // Add new markers for items
    items.forEach((item, index) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      
      console.log(`Processing item ${index + 1}/${items.length}:`, {
        id: item.id,
        title: item.title,
        type: item.type,
        lat: lat,
        lng: lng,
        isValidLat: !isNaN(lat),
        isValidLng: !isNaN(lng)
      });
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates for item:', item.id, 'lat:', lat, 'lng:', lng);
        return;
      }

      const markerColor = getMarkerColor(item.type);
      console.log(`Creating marker for ${item.title} at [${lng}, ${lat}] with color ${markerColor}`);

      try {
        const marker = new mapboxgl.Marker({
          color: markerColor,
          scale: 1.0 // Make markers more visible
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ 
              offset: 25,
              closeButton: true,
              closeOnClick: false
            }).setHTML(createPopupContent(item))
          );

        // Add the marker to the map
        marker.addTo(map);
        console.log(`Marker added to map for ${item.title}`);

        // Add single-click event listener for highlighting
        marker.getElement().addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('Marker clicked:', item.title);
          if (onMarkerClick) onMarkerClick(item);
        });

        // Add double-click event listener for navigation
        marker.getElement().addEventListener('dblclick', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Marker double-clicked:', item.title);
          if (onMarkerDoubleClick) onMarkerDoubleClick(item);
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('Error creating marker for item:', item.id, error);
      }
    });

    console.log(`Total markers created: ${markersRef.current.length}`);

    // Fit map to show all markers if there are any
    if (items.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        let validBounds = false;
        
        items.forEach(item => {
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.extend([lng, lat]);
            validBounds = true;
          }
        });
        
        if (validBounds) {
          if (items.length > 1) {
            console.log('Fitting bounds for multiple markers');
            map.fitBounds(bounds, { 
              padding: 50,
              maxZoom: 15
            });
          } else if (items.length === 1) {
            // For single marker, center on it
            const item = items[0];
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            console.log('Centering on single marker:', [lng, lat]);
            map.setCenter([lng, lat]);
            map.setZoom(14);
          }
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }

    console.log('=== MARKER MANAGER UPDATE COMPLETE ===');
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);

  return { markersRef };
};
