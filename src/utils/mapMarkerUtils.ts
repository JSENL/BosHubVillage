import { UnifiedItem } from '@/types/unifiedItem';
import { getCategoryColor } from '@/utils/categoryIcons';

export const validateCoordinates = (item: UnifiedItem) => {
  const rawLat = item.latitude;
  const rawLng = item.longitude;
  
  console.log(`📍 Processing item "${item.title}" (${item.type}):`, {
    rawLat,
    rawLng,
    id: item.id,
    address: item.address
  });

  if (rawLat === null || rawLat === undefined || rawLng === null || rawLng === undefined) {
    console.warn(`❌ Missing coordinates for ${item.type} "${item.title}"`);
    return null;
  }

  const lat = Number(rawLat);
  const lng = Number(rawLng);

  if (isNaN(lat) || isNaN(lng)) {
    console.warn(`❌ Invalid coordinates (NaN) for ${item.type} "${item.title}"`);
    return null;
  }

  if (lat === 0 && lng === 0) {
    console.warn(`⚠️ Zero coordinates detected for ${item.type} "${item.title}"`);
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    console.warn(`❌ Coordinates out of valid range for ${item.type} "${item.title}"`);
    return null;
  }

  return { lat, lng };
};

// Get marker color based on category first, then type as fallback
export const getMarkerColor = (type: string, category?: string): string => {
  // Try category-based color first
  if (category) {
    return getCategoryColor(category, type);
  }
  
  // Fallback to type-based colors
  switch (type) {
    case 'event': return 'hsl(5, 75%, 55%)';
    case 'business': return 'hsl(210, 75%, 45%)';
    case 'local-service': return 'hsl(15, 85%, 65%)';
    case 'news': return 'hsl(220, 50%, 50%)';
    default: return 'hsl(220, 15%, 45%)';
  }
};

// Create a custom marker element with category-based styling
export const createCustomMarker = (item: UnifiedItem): HTMLElement => {
  const markerEl = document.createElement('div');
  const color = getMarkerColor(item.type, item.category);
  
  // Parse HSL to create darker border
  const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  let borderColor = color;
  if (match) {
    const [, h, s, l] = match;
    borderColor = `hsl(${h}, ${s}%, ${Math.max(Number(l) - 15, 20)}%)`;
  }
  
  markerEl.className = 'custom-map-marker';
  markerEl.style.cssText = `
    width: 32px;
    height: 32px;
    background: ${color};
    border: 3px solid ${borderColor};
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    cursor: pointer;
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // Add inner circle for visual appeal
  const innerCircle = document.createElement('div');
  innerCircle.style.cssText = `
    width: 12px;
    height: 12px;
    background: rgba(255,255,255,0.9);
    border-radius: 50%;
    transform: rotate(45deg);
  `;
  markerEl.appendChild(innerCircle);
  
  // Add hover effect
  markerEl.addEventListener('mouseenter', () => {
    markerEl.style.transform = 'rotate(-45deg) scale(1.15)';
    markerEl.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)';
    markerEl.style.zIndex = '1000';
  });
  
  markerEl.addEventListener('mouseleave', () => {
    markerEl.style.transform = 'rotate(-45deg) scale(1)';
    markerEl.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
    markerEl.style.zIndex = 'auto';
  });
  
  return markerEl;
};

// Create cluster marker with count
export const createClusterMarker = (count: number, types: string[]): HTMLElement => {
  const markerEl = document.createElement('div');
  
  // Determine dominant color based on most common type
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantType = Object.entries(typeCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'event';
  const color = getMarkerColor(dominantType);
  
  markerEl.className = 'cluster-map-marker';
  markerEl.style.cssText = `
    width: ${Math.min(40 + count * 2, 60)}px;
    height: ${Math.min(40 + count * 2, 60)}px;
    background: ${color};
    border: 3px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: ${Math.min(14 + count, 18)}px;
    color: white;
    transition: transform 0.2s ease;
  `;
  
  markerEl.textContent = count.toString();
  
  markerEl.addEventListener('mouseenter', () => {
    markerEl.style.transform = 'scale(1.1)';
  });
  
  markerEl.addEventListener('mouseleave', () => {
    markerEl.style.transform = 'scale(1)';
  });
  
  return markerEl;
};
