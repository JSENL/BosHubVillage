
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Event } from '@/hooks/useEvents';

interface UseMapMarkersProps {
  map: mapboxgl.Map | null;
  events: Event[];
  onMarkerClick: (event: Event) => void;
  createPopupContent: (event: Event) => string;
}

export const useMapMarkers = ({ 
  map, 
  events, 
  onMarkerClick, 
  createPopupContent 
}: UseMapMarkersProps) => {
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for filtered events
    events.forEach((event) => {
      if (event.latitude && event.longitude) {
        const marker = new mapboxgl.Marker({
          color: '#dc2626'
        })
          .setLngLat([event.longitude, event.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(createPopupContent(event))
          )
          .addTo(map);

        marker.getElement().addEventListener('click', () => {
          onMarkerClick(event);
        });

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are any
    if (events.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      events.forEach(event => {
        if (event.latitude && event.longitude) {
          bounds.extend([event.longitude, event.latitude]);
        }
      });
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, events, onMarkerClick, createPopupContent]);

  return { markersRef };
};
