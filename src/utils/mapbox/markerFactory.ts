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