
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

    // Enhanced element finding with multiple ID patterns
    setTimeout(() => {
      const possibleIds = [
        `item-${item.id}`,
        `event-${item.id}`,
        `news-${item.id}`,
        `business-${item.id}`,
        `service-${item.id}`,
        `local-service-${item.id}`
      ];
      
      let itemElement = null;
      for (const id of possibleIds) {
        itemElement = document.getElementById(id);
        if (itemElement) {
          console.log(`✅ Found element with ID: ${id}`);
          break;
        }
      }
      
      if (itemElement) {
        itemElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        itemElement.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-75');
        setTimeout(() => {
          itemElement?.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-75');
        }, 3000);
      } else {
        console.warn('⚠️ Item element not found for any ID pattern:', possibleIds);
      }
    }, 100);
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
