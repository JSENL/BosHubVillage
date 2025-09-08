
import mapboxgl from 'mapbox-gl';
import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates, getMarkerColor, createPopupContent } from './mapMarkerUtils';
import { 
  createSponsoredMarkerElement, 
  injectSponsoredMarkerStyles, 
  getMarkerConfig 
} from './sponsoredMarkerUtils';

export const createMarkerElement = (item: UnifiedItem): HTMLDivElement => {
  // Inject sponsored marker styles on first use
  injectSponsoredMarkerStyles();

  // Check if item is sponsored
  const isSponsored = (item as any).is_sponsored || false;
  
  // Debug logging
  console.log(`🎯 Creating marker for: ${item.title}, sponsored: ${isSponsored}, type: ${item.type}`);
  
  if (isSponsored) {
    console.log(`✨ Creating SPONSORED marker for: ${item.title}`);
    // Create sponsored marker with visual effects
    const markerConfig = getMarkerConfig(item.type, true);
    const sponsoredElement = createSponsoredMarkerElement(markerConfig);
    
    // Add click data attributes
    sponsoredElement.setAttribute('data-item-id', item.id);
    sponsoredElement.setAttribute('data-item-type', item.type);
    
    return sponsoredElement as HTMLDivElement;
  } else {
    // Create regular marker (existing code)
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
      position: relative;
      transform-origin: center center;
    `;

    const typeIndicator = item.type.charAt(0).toUpperCase();
    markerElement.textContent = typeIndicator;

    // Add hover effects that don't affect positioning
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
  }
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
    className: 'custom-popup',
    anchor: 'bottom'
  }).setHTML(createPopupContent(item));

  // Create marker with proper anchor
  const marker = new mapboxgl.Marker({
    element: markerElement,
    anchor: 'center'
  })
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(map);

  let clickTimeout: NodeJS.Timeout | null = null;

  // Add single click handler with delay to distinguish from double-click
  markerElement.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      return;
    }

    clickTimeout = setTimeout(() => {
      console.log(`📍 Marker clicked: ${item.title} (${item.type})`);
      
      // Toggle popup visibility
      if (popup.isOpen()) {
        popup.remove();
      } else {
        popup.addTo(map);
      }
      
      if (onMarkerClick) {
        onMarkerClick(item);
      }
      
      clickTimeout = null;
    }, 200);
  });

  // Add double-click handler
  markerElement.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
    
    console.log(`🖱️ Marker double-clicked: ${item.title} (${item.type})`);
    
    // Ensure popup stays open on double-click
    if (!popup.isOpen()) {
      popup.addTo(map);
    }
    
    if (onMarkerDoubleClick) {
      onMarkerDoubleClick(item);
    }
  });

  // Add hover functionality to show popup on hover
  markerElement.addEventListener('mouseenter', () => {
    if (!popup.isOpen()) {
      popup.addTo(map);
    }
  });

  markerElement.addEventListener('mouseleave', () => {
    // Only close popup on mouse leave if it wasn't explicitly opened by click
    // We'll add a flag to track this
    setTimeout(() => {
      if (popup.isOpen() && !markerElement.dataset.clickOpened) {
        popup.remove();
      }
    }, 100); // Small delay to prevent flickering when moving between marker and popup
  });

  // Update click handler to track when popup is explicitly opened
  const originalClickHandler = markerElement.onclick;
  markerElement.addEventListener('click', (e) => {
    if (popup.isOpen()) {
      markerElement.dataset.clickOpened = '';
      delete markerElement.dataset.clickOpened;
    } else {
      markerElement.dataset.clickOpened = 'true';
    }
  }, true); // Use capture phase to run before other click handlers

  return marker;
};
