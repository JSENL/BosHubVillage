
import { UnifiedItem } from '@/types/unifiedItem';

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

export const getMarkerColor = (type: string): string => {
  switch (type) {
    case 'event': return 'hsl(5, 75%, 55%)'; // Warm red from logo
    case 'business': return 'hsl(210, 75%, 45%)'; // Vibrant blue from logo
    case 'local-service': return 'hsl(15, 85%, 65%)'; // Coral orange from logo
    default: return 'hsl(220, 15%, 45%)'; // Muted gray
  }
};

