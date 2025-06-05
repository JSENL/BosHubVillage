
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
}

const EventsMap = ({ searchQuery, selectedCategory, events }: EventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const navigate = useNavigate();
  const { apiKey, mapLoaded, isLoadingApiKey, loadMap } = useMapLoader();

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      const map = await loadMap(mapRef);
      if (map) {
        mapInstanceRef.current = map;
      }
    };

    initializeMap();
  }, [apiKey, loadMap]);

  // Add markers for filtered events
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !window.google) return;

    // Clear existing markers
    markersRef.current = clearMarkers(markersRef.current);

    // Add new markers for filtered events
    filteredEvents.forEach((event) => {
      const marker = createEventMarker({
        event,
        map: mapInstanceRef.current!,
        onMarkerClick: (event, position) => {
          // Close any open info windows
          closeAllInfoWindows(markersRef.current);
          setSelectedEvent(event);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (filteredEvents.length > 0 && markersRef.current.length > 0) {
      fitMapToBounds(mapInstanceRef.current, markersRef.current);
    }
  }, [filteredEvents, mapLoaded]);

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
      <div className="lg:col-span-2 bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-lg">
        <div ref={mapRef} className="w-full h-full rounded-2xl" />
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
