import { UnifiedItem } from '@/types/unifiedItem';
import { validateCoordinates } from '@/utils/common/coordinateUtils';

/**
 * Groups items by their exact location coordinates
 * Items within a very small distance (≈10 meters) are considered at the same location
 */
export const groupItemsByLocation = (items: UnifiedItem[]): Array<{
  location: { lat: number; lng: number };
  items: UnifiedItem[];
  primaryItem: UnifiedItem; // The item to use for marker display
}> => {
  const locationGroups = new Map<string, UnifiedItem[]>();
  const PROXIMITY_THRESHOLD = 0.0001; // Approximately 10 meters

  // Group items by approximate location
  items.forEach(item => {
    const coords = validateCoordinates(item);
    if (!coords) return;

    // Round coordinates to create location groups
    const roundedLat = Math.round(coords.lat / PROXIMITY_THRESHOLD) * PROXIMITY_THRESHOLD;
    const roundedLng = Math.round(coords.lng / PROXIMITY_THRESHOLD) * PROXIMITY_THRESHOLD;
    const locationKey = `${roundedLat.toFixed(6)},${roundedLng.toFixed(6)}`;

    if (!locationGroups.has(locationKey)) {
      locationGroups.set(locationKey, []);
    }
    locationGroups.get(locationKey)!.push(item);
  });

  // Convert to array with location data
  return Array.from(locationGroups.entries()).map(([locationKey, groupItems]) => {
    const [lat, lng] = locationKey.split(',').map(Number);
    
    // Sort events by date/time if they're events
    const sortedItems = groupItems.sort((a, b) => {
      if (a.type === 'event' && b.type === 'event') {
        // Sort events by date first, then time
        if (a.date && b.date) {
          const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateCompare !== 0) return dateCompare;
          
          // If same date, sort by start time
          if (a.start_time && b.start_time) {
            return a.start_time.localeCompare(b.start_time);
          }
        }
      }
      return a.title.localeCompare(b.title);
    });

    // Use the first (chronologically earliest for events) item as the primary
    const primaryItem = sortedItems[0];

    return {
      location: { lat, lng },
      items: sortedItems,
      primaryItem
    };
  });
};

/**
 * Checks if a location has multiple items
 */
export const hasMultipleItems = (locationGroup: { items: UnifiedItem[] }): boolean => {
  return locationGroup.items.length > 1;
};

/**
 * Gets events at the same location on the same day
 */
export const getEventsAtSameLocationAndDay = (items: UnifiedItem[]): UnifiedItem[][] => {
  const eventGroups = new Map<string, UnifiedItem[]>();
  
  items
    .filter(item => item.type === 'event' && item.date)
    .forEach(event => {
      const coords = validateCoordinates(event);
      if (!coords) return;
      
      // Create a key based on location and date
      const locationKey = `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
      const dateKey = event.date;
      const key = `${locationKey}_${dateKey}`;
      
      if (!eventGroups.has(key)) {
        eventGroups.set(key, []);
      }
      eventGroups.get(key)!.push(event);
    });
  
  // Return only groups with multiple events
  return Array.from(eventGroups.values()).filter(group => group.length > 1);
};