
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
      console.log('⏸️ Map not ready for markers');
      return;
    }

    console.log('🎯 MARKER MANAGER UPDATE');
    console.log('📊 Items to process:', items.length);

    // Clear existing markers
    console.log('🧹 Clearing existing markers:', markersRef.current.length);
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // Process each item for markers
    items.forEach((item, index) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      
      console.log(`📍 Processing marker ${index + 1}/${items.length}:`, {
        id: item.id,
        title: item.title,
        type: item.type,
        originalLat: item.latitude,
        originalLng: item.longitude,
        convertedLat: lat,
        convertedLng: lng,
        isValidLat: !isNaN(lat) && lat >= -90 && lat <= 90,
        isValidLng: !isNaN(lng) && lng >= -180 && lng <= 180
      });
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn('❌ Invalid coordinates for item:', {
          id: item.id,
          title: item.title,
          lat: lat,
          lng: lng
        });
        return;
      }

      const markerColor = getMarkerColor(item.type);
      console.log(`🎨 Creating marker for "${item.title}" at [${lng}, ${lat}] with color ${markerColor}`);

      try {
        // Create marker with enhanced visibility
        const marker = new mapboxgl.Marker({
          color: markerColor,
          scale: 1.2, // Make markers more visible
          anchor: 'bottom'
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ 
              offset: 25,
              closeButton: true,
              closeOnClick: false,
              className: 'custom-popup'
            }).setHTML(createPopupContent(item))
          );

        // Add the marker to the map
        marker.addTo(map);
        console.log(`✅ Marker successfully added for "${item.title}"`);

        // Add click event listeners
        const markerElement = marker.getElement();
        
        // Single click for highlighting
        markerElement.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log('🖱️ Marker clicked:', item.title);
          if (onMarkerClick) onMarkerClick(item);
        });

        // Double click for navigation
        markerElement.addEventListener('dblclick', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🖱️ Marker double-clicked:', item.title);
          if (onMarkerDoubleClick) onMarkerDoubleClick(item);
        });

        // Add hover effect
        markerElement.style.cursor = 'pointer';
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.1)';
        });
        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error('❌ Error creating marker for item:', item.id, error);
      }
    });

    console.log(`📊 Total markers created: ${markersRef.current.length}`);

    // Fit map to show all markers if there are any
    if (items.length > 0 && markersRef.current.length > 0) {
      try {
        const bounds = new mapboxgl.LngLatBounds();
        let validBounds = false;
        
        items.forEach(item => {
          const lat = Number(item.latitude);
          const lng = Number(item.longitude);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            bounds.extend([lng, lat]);
            validBounds = true;
          }
        });
        
        if (validBounds) {
          if (items.length > 1) {
            console.log('🎯 Fitting bounds for multiple markers');
            map.fitBounds(bounds, { 
              padding: 80,
              maxZoom: 15,
              duration: 1000
            });
          } else if (items.length === 1) {
            const item = items[0];
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            console.log('🎯 Centering on single marker:', [lng, lat]);
            map.flyTo({
              center: [lng, lat],
              zoom: 14,
              duration: 1000
            });
          }
        }
      } catch (error) {
        console.error('❌ Error fitting bounds:', error);
      }
    }

    console.log('✅ MARKER MANAGER UPDATE COMPLETE');
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);

  return { markersRef };
};
