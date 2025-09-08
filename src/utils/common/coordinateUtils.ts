import { UnifiedItem } from '@/types/unifiedItem';

/**
 * Validates if coordinates are valid for mapping
 */
export const validateCoordinates = (item: UnifiedItem) => {
  const lat = Number(item.latitude);
  const lng = Number(item.longitude);
  
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    return null;
  }
  
  // Basic bounds checking
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  
  return { lat, lng };
};

/**
 * Calculates distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Gets the bounds for a collection of items
 */
export const getItemsBounds = (items: UnifiedItem[]) => {
  const validCoords = items
    .map(validateCoordinates)
    .filter(Boolean) as { lat: number; lng: number }[];
    
  if (validCoords.length === 0) return null;
  
  const lats = validCoords.map(coord => coord.lat);
  const lngs = validCoords.map(coord => coord.lng);
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};