
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/hooks/useEvents';
import { useMapLoader } from '@/hooks/useMapLoader';
import { createEventMarker } from './map/MapMarker';
import { EventsSidebar } from './map/EventsSidebar';
import { MapLoadingState, MapErrorState } from './map/MapLoadingState';
import { fitMapToBounds, clearMarkers, closeAllInfoWindows } from '@/utils/mapUtils';

interface EventsMapProps {
  searchQuery: string;
  selectedCategory: string;
  events: Event[];
  onEventSelect?: (eventId: string) => void;
}

const EventsMap = ({ searchQuery, selectedCategory, events, onEventSelect }: EventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const { apiKey, mapLoaded, isLoadingApiKey, loadMap } = useMapLoader();

  console.log('EventsMap rendered with events:', events.length);
  console.log('Map loaded state:', mapLoaded);
  console.log('API key available:', !!apiKey);

  // Filter events based on search and category, only include events with coordinates
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const hasCoordinates = event.latitude !== null && event.longitude !== null;
    return matchesSearch && matchesCategory && hasCoordinates;
  });

  console.log('Filtered events with coordinates:', filteredEvents.length);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      console.log('Attempting to initialize map...');
      if (!apiKey) {
        console.log('No API key available yet');
        return;
      }
      
      const map = await loadMap(mapRef);
      if (map) {
        console.log('Map successfully initialized');
        mapInstanceRef.current = map;
      } else {
        console.error('Failed to initialize map');
      }
    };

    initializeMap();
  }, [apiKey, loadMap]);

  // Add markers for filtered events
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !window.google) {
      console.log('Map not ready for markers:', {
        mapInstance: !!mapInstanceRef.current,
        mapLoaded,
        googleAvailable: !!window.google
      });
      return;
    }

    console.log('Adding markers for', filteredEvents.length, 'events');

    // Clear existing markers
    markersRef.current = clearMarkers(markersRef.current);

    // Add new markers for filtered events
    filteredEvents.forEach((event) => {
      if (event.latitude && event.longitude) {
        console.log('Creating marker for event:', event.title);
        const marker = createEventMarker({
          event,
          map: mapInstanceRef.current!,
          position: { lat: event.latitude, lng: event.longitude },
          onMarkerClick: (event, position) => {
            console.log('Marker clicked:', event.title);
            // Close any open info windows
            closeAllInfoWindows(markersRef.current);
            setSelectedEvent(event);
            if (onEventSelect) {
              onEventSelect(event.id);
            }
          }
        });

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are any
    if (filteredEvents.length > 0 && markersRef.current.length > 0) {
      console.log('Fitting map bounds to show all markers');
      fitMapToBounds(mapInstanceRef.current, markersRef.current);
    }
  }, [filteredEvents, mapLoaded, onEventSelect]);

  const handleEventClick = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  if (isLoadingApiKey) {
    return <MapLoadingState />;
  }

  if (!apiKey) {
    return <MapErrorState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Container */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-red-200 overflow-hidden shadow-lg">
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-2xl" 
          style={{ minHeight: '400px' }}
        />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Event Details Sidebar */}
      <EventsSidebar 
        filteredEvents={filteredEvents}
        selectedEvent={selectedEvent}
        onEventClick={handleEventClick}
      />
    </div>
  );
};

export default EventsMap;
