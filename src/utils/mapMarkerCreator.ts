
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates, getMarkerColor, createPopupContent } from './mapMarkerUtils';

export const createMarkerElement = (item: UnifiedItem): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = 'marker-custom';
  markerElement.style.cssText = `
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: ${getMarkerColor(item.type)};
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 12px;
    z-index: 1;
  `;

  const typeIndicator = item.type.charAt(0).toUpperCase();
  markerElement.textContent = typeIndicator;

  // Add hover effects
  markerElement.addEventListener('mouseenter', () => {
    markerElement.style.transform = 'scale(1.2)';
    markerElement.style.zIndex = '1000';
    markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
  });
  
  markerElement.addEventListener('mouseleave', () => {
    markerElement.style.transform = 'scale(1)';
    markerElement.style.zIndex = '1';
    markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  });

  return markerElement;
};

export const createMapboxMarker = (
  item: UnifiedItem,
  map: mapboxgl.Map,
  onMarkerClick?: (item: UnifiedItem) => void,
  onMarkerDoubleClick?: (item: UnifiedItem) => void
): mapboxgl.Marker | null => {
  const coords = validateCoordinates(item);
  if (!coords) return null;

  const { lat, lng } = coords;
  const markerElement = createMarkerElement(item);

  // Create popup
  const popup = new mapboxgl.Popup({
    offset: 35,
    closeButton: true,
    closeOnClick: false,
    maxWidth: '320px',
    className: 'custom-popup'
  }).setHTML(createPopupContent(item));

  // Create marker
  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(map);

  // Add event listeners
  markerElement.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log(`📍 Marker clicked: ${item.title} (${item.type})`);
    
    if (popup.isOpen()) {
      popup.remove();
    } else {
      popup.addTo(map);
    }
    
    if (onMarkerClick) {
      onMarkerClick(item);
    }
  });

  markerElement.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    console.log(`🖱️ Marker double-clicked: ${item.title} (${item.type})`);
    
    if (onMarkerDoubleClick) {
      onMarkerDoubleClick(item);
    }
  });

  return marker;
};
