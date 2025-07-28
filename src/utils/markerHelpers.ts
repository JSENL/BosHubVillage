import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { getMarkerColor } from '@/utils/mapMarkerUtils';

export const createMarkerElement = (item: UnifiedItem): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-marker';
  markerElement.style.cssText = `
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${getMarkerColor(item.type)};
    border: 2px solid white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transition: transform 0.2s ease;
  `;
  
  markerElement.textContent = item.type.charAt(0);
  
  // Add hover effect
  markerElement.addEventListener('mouseenter', () => {
    markerElement.style.transform = 'scale(1.1)';
  });
  
  markerElement.addEventListener('mouseleave', () => {
    markerElement.style.transform = 'scale(1)';
  });

  return markerElement;
};

export const addMarkerEvents = (
  element: HTMLDivElement,
  item: UnifiedItem,
  onMarkerClick?: (item: UnifiedItem) => void,
  onMarkerDoubleClick?: (item: UnifiedItem) => void
) => {
  let clickTimeout: NodeJS.Timeout;

  element.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Clear any existing timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    
    // Set a timeout to distinguish between single and double click
    clickTimeout = setTimeout(() => {
      // Create popup on single click
      const popup = createPopup(item);
      const map = (element as any)._map;
      if (map) {
        popup.addTo(map);
      }
      
      // Call single click handler
      if (onMarkerClick) {
        onMarkerClick(item);
      }
    }, 200);
  });

  element.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    
    // Clear the single click timeout
    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }
    
    // Call double click handler
    if (onMarkerDoubleClick) {
      onMarkerDoubleClick(item);
    }
  });
};

const createPopup = (item: UnifiedItem): mapboxgl.Popup => {
  const popupContent = `
    <div style="padding: 12px; max-width: 250px; font-family: system-ui;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
        ${item.title}
      </h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">
        ${item.description.substring(0, 120)}${item.description.length > 120 ? '...' : ''}
      </p>
      <div style="margin-bottom: 8px; font-size: 12px; color: ${getMarkerColor(item.type)};">
        <strong>${item.type.toUpperCase()}</strong>
      </div>
      ${item.address ? `
        <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">
          📍 ${item.address}
        </div>
      ` : ''}
      ${item.date ? `
        <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">
          📅 ${new Date(item.date).toLocaleDateString()}
        </div>
      ` : ''}
      <div style="margin-top: 12px;">
        <button 
          onclick="window.location.href='/${item.type}/${item.id}'" 
          style="
            background: ${getMarkerColor(item.type)};
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 500;
          "
        >
          View Details
        </button>
      </div>
    </div>
  `;

  return new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px'
  })
  .setLngLat([item.longitude!, item.latitude!])
  .setHTML(popupContent);
};