import { UnifiedItem } from '@/types/unifiedItem';
import { getMarkerColor } from '@/utils/mapMarkerUtils';

export const createMarkerElement = (item: UnifiedItem): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = 'marker';
  markerElement.style.cssText = `
    background-image: url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png');
    background-size: cover;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s ease;
  `;
  
  // Add hover effect
  markerElement.addEventListener('mouseenter', () => {
    markerElement.style.transform = 'scale(1.1)';
  });
  
  markerElement.addEventListener('mouseleave', () => {
    markerElement.style.transform = 'scale(1)';
  });

  return markerElement;
};

export const addMarkerEventListeners = (
  element: HTMLDivElement,
  item: UnifiedItem,
  onSingleClick: (item: UnifiedItem) => void,
  onDoubleClick?: (item: UnifiedItem) => void
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
      onSingleClick(item);
    }, 200);
  });

  if (onDoubleClick) {
    element.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      
      // Clear the single click timeout
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      
      onDoubleClick(item);
    });
  }
};