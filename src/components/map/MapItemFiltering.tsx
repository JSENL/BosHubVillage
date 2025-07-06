
import { UnifiedItem } from '@/types/unifiedItem';

interface UseItemFilteringProps {
  items: UnifiedItem[];
  selectedTypes: string[];
}

export const useItemFiltering = ({ items, selectedTypes }: UseItemFilteringProps) => {
  const filteredMappableItems = items.filter(item => {
    const hasCoords = item.latitude !== null && 
                     item.longitude !== null && 
                     !isNaN(Number(item.latitude)) &&
                     !isNaN(Number(item.longitude));
    
    const isSelectedType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);
    const isValidCoords = lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    
    console.log(`🔍 Item Analysis: ${item.title}`, {
      id: item.id,
      type: item.type,
      rawLat: item.latitude,
      rawLng: item.longitude,
      convertedLat: lat,
      convertedLng: lng,
      hasCoords,
      isValidCoords,
      isSelectedType,
      willShow: hasCoords && isValidCoords && isSelectedType
    });
    
    return hasCoords && isValidCoords && isSelectedType;
  });

  return { filteredMappableItems };
};
