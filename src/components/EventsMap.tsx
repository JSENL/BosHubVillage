
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/hooks/useEvents';
import { EventsSidebar } from './map/EventsSidebar';
import { useEventHighlight } from '@/hooks/useEventHighlight';

interface EventsMapProps {
  searchQuery: string;
  selectedCategory: string;
  events: Event[];
  onEventSelect?: (eventId: string) => void;
}

const EventsMap = ({ searchQuery, selectedCategory, events, onEventSelect }: EventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const navigate = useNavigate();
  const { highlightedEventId, highlightEvent } = useEventHighlight();

  // Get Mapbox token
  useEffect(() => {
    const token = localStorage.getItem('mapbox_token') || 'pk.your_mapbox_token_here';
    setMapboxToken(token);
  }, []);

  // Filter events based on search and category, only include events with coordinates
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const hasCoordinates = event.latitude !== null && event.longitude !== null;
    return matchesSearch && matchesCategory && hasCoordinates;
  });

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapRef.current || !mapboxToken || mapboxToken === 'pk.your_mapbox_token_here') return;

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-71.0589, 42.3601], // Boston center
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [mapboxToken]);

  // Create popup content for events
  const createEventPopupContent = (event: Event): string => {
    const formatTimeRange = (startTime: string, endTime: string) => {
      if (!startTime && !endTime) return 'Time TBD';
      if (startTime && endTime) {
        return `${startTime} - ${endTime}`;
      }
      return startTime || endTime;
    };

    return `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${event.title}</h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280;">${event.description.substring(0, 100)}...</p>
        <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
          <strong>📅 ${new Date(event.date).toLocaleDateString()}</strong>
        </div>
        <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
          <strong>🕒 ${formatTimeRange(event.start_time, event.end_time)}</strong>
        </div>
        <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
          <strong>📍 ${event.location}</strong>
        </div>
        <div style="margin: 8px 0 0 0;">
          <button onclick="window.location.href='/event/${event.id}'" style="
            background: linear-gradient(to right, #8b5cf6, #3b82f6);
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 500;
          ">View Details</button>
        </div>
      </div>
    `;
  };

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
  useEffect(() => {
    if (!mapInstanceRef.current || filteredEvents.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for filtered events
    filteredEvents.forEach((event) => {
      if (event.latitude && event.longitude) {
        const marker = new mapboxgl.Marker({
          color: '#dc2626'
        })
          .setLngLat([event.longitude, event.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(createEventPopupContent(event))
          )
          .addTo(mapInstanceRef.current!);

        marker.getElement().addEventListener('click', () => {
          handleMarkerClick(event);
        });

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are any
    if (filteredEvents.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredEvents.forEach(event => {
        if (event.latitude && event.longitude) {
          bounds.extend([event.longitude, event.latitude]);
        }
      });
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [filteredEvents]);

  const handleEventClick = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  if (!mapboxToken || mapboxToken === 'pk.your_mapbox_token_here') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-2 bg-gray-100 rounded-2xl border border-red-200 overflow-hidden shadow-lg relative flex items-center justify-center flex-col p-8">
          <p className="text-gray-500 mb-4">Please enter your Mapbox token to display the map</p>
          <input
            type="text"
            placeholder="Enter your Mapbox public token"
            className="px-4 py-2 border rounded-lg mb-4 w-80"
            onChange={(e) => {
              localStorage.setItem('mapbox_token', e.target.value);
              setMapboxToken(e.target.value);
            }}
          />
          <p className="text-sm text-gray-400">Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">mapbox.com</a></p>
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
