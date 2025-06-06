
import { useState, useCallback } from 'react';

export const useEventHighlight = () => {
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);

  const highlightEvent = useCallback((eventId: string) => {
    setHighlightedEventId(eventId);
    
    // Scroll to the event card
    const eventElement = document.getElementById(`event-${eventId}`);
    if (eventElement) {
      eventElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }

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
