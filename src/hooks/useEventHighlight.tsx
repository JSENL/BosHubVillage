
import { useState, useCallback } from 'react';

export const useEventHighlight = () => {
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);

  const highlightEvent = useCallback((eventId: string) => {
    console.log('Highlighting event:', eventId);
    setHighlightedEventId(eventId);
    
    // Small delay to ensure the component has re-rendered
    setTimeout(() => {
      const eventElement = document.getElementById(`event-${eventId}`);
      if (eventElement) {
        console.log('Scrolling to event element:', eventId);
        eventElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      } else {
        console.warn('Event element not found:', `event-${eventId}`);
      }
    }, 100);

    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedEventId(null);
    }, 3000);
  }, []);

  return {
    highlightedEventId,
    highlightEvent
  };
};
