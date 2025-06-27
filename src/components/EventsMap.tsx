
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';
import { EventsSidebar } from './map/EventsSidebar';
import { useEventHighlight } from '@/hooks/useEventHighlight';
import { useMapLoader } from '@/hooks/useMapLoader';
import { useMapboxMap } from '@/hooks/useMapboxMap';
import { useMapMarkers } from '@/hooks/useMapMarkers';
import { createEventPopupContent } from '@/utils/mapPopupUtils';

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
  const { apiKey: mapboxToken, isLoadingApiKey, error } = useMapLoader();

  // Use the filtered events passed from parent instead of filtering here
  const filteredEvents = events.filter(event => {
    const hasCoordinates = event.latitude !== null && event.longitude !== null;
    return hasCoordinates;
  });

  // Initialize Mapbox map
  const { mapRef, mapInstance } = useMapboxMap({ 
    mapboxToken, 
    isLoadingApiKey 
  });

  // Handle marker click to highlight event card
  const handleMarkerClick = (event: Event) => {
    console.log('Marker clicked for event:', event.title);
    
    // Set selected event
    setSelectedEvent(event);
    
    // Highlight and scroll to the event card
    highlightEvent(event.id);
    
    // Call optional event select callback
    if (onEventSelect) {
      onEventSelect(event.id);
    }
  };

  // Add markers for filtered events
  useMapMarkers({
    map: mapInstance,
    events: filteredEvents,
    onMarkerClick: handleMarkerClick,
    createPopupContent: createEventPopupContent
  });

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
