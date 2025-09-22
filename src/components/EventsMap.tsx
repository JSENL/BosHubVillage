
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';
import { UnifiedItem } from '@/types/unifiedItem';
import { EventsSidebar } from './map/EventsSidebar';
import { useEventHighlight } from '@/hooks/useEventHighlight';
import { useMapboxToken } from '@/contexts/MapboxContext';
import { useMapboxMap } from '@/hooks/useMapboxMap';


interface EventsMapProps {
  searchQuery: string;
  selectedCategory: string;
  events: Event[];
  onEventSelect?: (eventId: string) => void;
}

const EventsMap = ({ searchQuery, selectedCategory, events, onEventSelect }: EventsMapProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const { highlightedEventId, highlightEvent } = useEventHighlight();
  const { mapboxToken, isLoadingApiKey, error } = useMapboxToken();

  // Use the filtered events passed from parent instead of filtering here
  const filteredEvents = events.filter(event => {
    const hasCoordinates = event.latitude !== null && event.longitude !== null;
    return hasCoordinates;
  });

  // Convert events to UnifiedItem format for the map
  const unifiedEvents = useMemo<UnifiedItem[]>(() => {
    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      latitude: event.latitude,
      longitude: event.longitude,
      type: 'event' as const,
      address: event.address,
      location: event.location,
      category: event.category,
      date: event.date,
      start_time: event.start_time,
      end_time: event.end_time,
      price: event.price,
      originalData: event // Store original event data for backwards compatibility
    }));
  }, [filteredEvents]);

  // Initialize Mapbox map
  const { mapRef, mapInstance } = useMapboxMap({ 
    mapboxToken, 
    isLoadingApiKey 
  });

  // Handle marker click to highlight event card
  const handleMarkerClick = (item: UnifiedItem) => {
    console.log('Marker clicked for event:', item.title);
    
    // Find the original event using the stored originalData
    const originalEvent = item.originalData as Event;
    
    // Set selected event
    setSelectedEvent(originalEvent);
    
    // Highlight and scroll to the event card
    highlightEvent(item.id);
    
    // Call optional event select callback
    if (onEventSelect) {
      onEventSelect(item.id);
    }
  };

  // Markers are handled by useMapClusters in EnhancedUniversalMap
  // No need for additional useMapMarkers call here

  const handleEventClick = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  if (isLoadingApiKey) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-2 bg-gray-100 rounded-2xl border border-red-200 overflow-hidden shadow-lg relative flex items-center justify-center flex-col p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
        <EventsSidebar 
          filteredEvents={filteredEvents}
          selectedEvent={selectedEvent}
          onEventClick={handleEventClick}
          highlightedEventId={highlightedEventId}
        />
      </div>
    );
  }

  if (error || !mapboxToken) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-2 bg-gray-100 rounded-2xl border border-red-200 overflow-hidden shadow-lg relative flex items-center justify-center flex-col p-8">
          <p className="text-red-500 mb-4">{error || 'Failed to load Mapbox API key'}</p>
          <p className="text-sm text-gray-400">Please check your Mapbox configuration</p>
        </div>
        <EventsSidebar 
          filteredEvents={filteredEvents}
          selectedEvent={selectedEvent}
          onEventClick={handleEventClick}
          highlightedEventId={highlightedEventId}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Container */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-red-200 overflow-hidden shadow-lg relative">
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-2xl" 
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Event Details Sidebar */}
      <EventsSidebar 
        filteredEvents={filteredEvents}
        selectedEvent={selectedEvent}
        onEventClick={handleEventClick}
        highlightedEventId={highlightedEventId}
      />
    </div>
  );
};

export default EventsMap;
