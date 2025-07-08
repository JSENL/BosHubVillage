
import { useNavigate } from 'react-router-dom';
import { UnifiedItem } from '@/types/unifiedItem';

interface UseMapClickHandlersProps {
  onItemClick?: (item: UnifiedItem) => void;
}

export const useMapClickHandlers = ({ onItemClick }: UseMapClickHandlersProps) => {
  const navigate = useNavigate();

  const handleMarkerClick = (item: UnifiedItem) => {
    console.log('📍 Marker clicked:', item.title, 'ID:', item.id);
    
    if (onItemClick) {
      onItemClick(item);
    }

    // Show popup information instead of scrolling - the popup will be handled by the marker itself
    // No need to scroll to the element, just let the popup show
  };

  const handleMarkerDoubleClick = (item: UnifiedItem) => {
    console.log('🖱️ Marker double-clicked:', item.title, 'Type:', item.type);
    
    // Navigate to the appropriate detail page based on item type
    switch (item.type) {
      case 'event':
        navigate(`/event/${item.id}`);
        break;
      case 'news':
        navigate(`/news/${item.id}`);
        break;
      case 'business':
        navigate(`/business/${item.id}`);
        break;
      case 'local-service':
        navigate(`/local-service/${item.id}`);
        break;
      default:
        console.warn('Unknown item type for navigation:', item.type);
    }
  };

  return {
    handleMarkerClick,
    handleMarkerDoubleClick
  };
};
