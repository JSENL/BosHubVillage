
import { useNavigate } from 'react-router-dom';
import { UnifiedItem } from '@/types/unifiedItem';
import { useToast } from '@/hooks/use-toast';

interface UseMapClickHandlersProps {
  onItemClick?: (item: UnifiedItem) => void;
}

export const useMapClickHandlers = ({ onItemClick }: UseMapClickHandlersProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    
    // Show the marker name in a toast
    toast({
      title: item.title,
      description: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} marker`,
    });
  };

  return {
    handleMarkerClick,
    handleMarkerDoubleClick
  };
};
