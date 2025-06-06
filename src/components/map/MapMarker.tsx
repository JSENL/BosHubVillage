
import { Event } from '@/hooks/useEvents';
import { createInfoWindowContent } from './MapInfoWindow';

interface MarkerConfig {
  event: Event;
  map: google.maps.Map;
  position: { lat: number; lng: number };
  onMarkerClick: (event: Event, position: { lat: number; lng: number }) => void;
}

export const createMarkerIcon = (price: number): google.maps.Icon => {
  const priceText = price === 0 ? 'FREE' : `$${price}`;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#8b5cf6" stroke="white" stroke-width="3"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
        <text x="20" y="25" text-anchor="middle" fill="#8b5cf6" font-size="8" font-weight="bold">${priceText}</text>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20)
  };
};

export const createEventMarker = ({ event, map, position, onMarkerClick }: MarkerConfig): google.maps.Marker => {
  const marker = new window.google.maps.Marker({
    position: position,
    map: map,
    title: event.title,
    icon: createMarkerIcon(event.price)
  });

  // Create info window content
  const infoWindow = new window.google.maps.InfoWindow({
    content: createInfoWindowContent(event)
  });

  marker.addListener('click', () => {
    onMarkerClick(event, position);
    infoWindow.open(map, marker);
    (marker as any).infoWindow = infoWindow;
    map.panTo(position);
  });

  (marker as any).infoWindow = infoWindow;
  return marker;
};
