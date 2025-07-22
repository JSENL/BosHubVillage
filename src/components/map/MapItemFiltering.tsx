
import { UnifiedItem } from '@/types/unifiedItem';

interface UseItemFilteringProps {
  items: UnifiedItem[];
  selectedTypes: string[];
}

export const useItemFiltering = ({ items, selectedTypes }: UseItemFilteringProps) => {
  const filteredMappableItems = items.filter(item => {
    // Check if item has coordinates - be more lenient with coordinate checking
    const hasLat = item.latitude !== null && item.latitude !== undefined;
    const hasLng = item.longitude !== null && item.longitude !== undefined;
    
    // Only require non-zero if we have actual numbers
    const lat = hasLat ? Number(item.latitude) : null;
    const lng = hasLng ? Number(item.longitude) : null;
    
    const hasValidNumbers = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);
    const hasReasonableCoords = hasValidNumbers && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    
    // For businesses, allow zero coordinates temporarily but still require valid numbers
    const hasCoords = hasValidNumbers && hasReasonableCoords;
    
    const isSelectedType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    
    console.log(`🔍 Item Analysis: ${item.title}`, {
      id: item.id,
      type: item.type,
      rawLat: item.latitude,
      rawLng: item.longitude,
      hasLat,
      hasLng,
      convertedLat: lat,
      convertedLng: lng,
      hasValidNumbers,
      hasReasonableCoords,
      hasCoords,
      isSelectedType,
      willShow: hasCoords && isSelectedType,
      address: item.address,
      zeroCoords: lat === 0 && lng === 0
    });
    
    const shouldShow = hasCoords && isSelectedType;
    
    if (item.type === 'business') {
      console.log(`🏢 Business Item "${item.title}":`, {
        shouldShow,
        hasCoords,
        isSelectedType,
        selectedTypes,
        coordinates: { lat, lng },
        id: item.id
      });
    }
    
    return shouldShow;
  });

  console.log(`🎯 Filtering Summary:`, {
    totalItems: items.length,
    selectedTypes,
    filteredItems: filteredMappableItems.length,
    itemsWithoutCoords: items.filter(item => 
      !item.latitude || !item.longitude || 
      isNaN(Number(item.latitude)) || isNaN(Number(item.longitude))
    ).length,
    businessItems: items.filter(item => item.type === 'business').length,
    businessItemsWithCoords: items.filter(item => 
      item.type === 'business' && 
      item.latitude && item.longitude && 
      !isNaN(Number(item.latitude)) && !isNaN(Number(item.longitude))
    ).length,
    businessItemsWithValidCoords: items.filter(item => {
      if (item.type !== 'business') return false;
      const lat = Number(item.latitude);
      const lng = Number(item.longitude);
      return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    }).length
  });

  return { filteredMappableItems };
};
