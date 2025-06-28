
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
    if (!map) return;

    console.log('Updating map markers. Items:', items.length);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for items
    items.forEach((item) => {
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates for item:', item.id, lat, lng);
        return;
      }

      const marker = new mapboxgl.Marker({
        color: getMarkerColor(item.type),
        scale: 0.8
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false
          }).setHTML(createPopupContent(item))
        )
        .addTo(map);

      // Add single-click event listener for highlighting
      marker.getElement().addEventListener('click', (e) => {
        e.stopPropagation();
        if (onMarkerClick) onMarkerClick(item);
      });

      // Add double-click event listener for navigation
      marker.getElement().addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onMarkerDoubleClick) onMarkerDoubleClick(item);
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (items.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      items.forEach(item => {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lng, lat]);
        }
      });
      
      // Only fit bounds if we have more than one marker
      if (items.length > 1) {
        map.fitBounds(bounds, { 
          padding: 50,
          maxZoom: 15
        });
      } else if (items.length === 1) {
        // For single marker, center on it
        const item = items[0];
        map.setCenter([Number(item.longitude), Number(item.latitude)]);
        map.setZoom(14);
      }
    }
  }, [map, items, onMarkerClick, onMarkerDoubleClick]);

  return { markersRef };
};
