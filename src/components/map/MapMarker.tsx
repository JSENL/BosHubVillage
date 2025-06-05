
import { Event } from '@/hooks/useEvents';
import { createInfoWindowContent } from './MapInfoWindow';

interface MarkerConfig {
  event: Event;
  map: google.maps.Map;
  onMarkerClick: (event: Event, position: { lat: number; lng: number }) => void;
}

export const createMarkerIcon = (price: number): google.maps.Icon => {
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#8b5cf6" stroke="white" stroke-width="3"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
        <text x="20" y="25" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="bold">$${price}</text>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20)
  };
};

export const createEventMarker = ({ event, map, onMarkerClick }: MarkerConfig): google.maps.Marker => {
  // Generate coordinates around Dorchester/Boston area for demo purposes
  const lat = 42.3152 + (Math.random() - 0.5) * 0.08;
  const lng = -71.0685 + (Math.random() - 0.5) * 0.08;

  const marker = new window.google.maps.Marker({
    position: { lat, lng },
    map: map,
    title: event.title,
    icon: createMarkerIcon(event.price)
  });

  // Create info window content
  const infoWindow = new window.google.maps.InfoWindow({
    content: createInfoWindowContent(event)
  });

  marker.addListener('click', () => {
    onMarkerClick(event, { lat, lng });
    infoWindow.open(map, marker);
    (marker as any).infoWindow = infoWindow;
    map.panTo({ lat, lng });
  });

  (marker as any).infoWindow = infoWindow;
  return marker;
};
