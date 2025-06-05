
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface EventsMapProps {
  searchQuery: string;
  selectedCategory: string;
  events: Event[];
}

const EventsMap = ({ searchQuery, selectedCategory, events }: EventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);
  const navigate = useNavigate();

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fetch Google Maps API key from edge function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-maps-key');
        
        if (error) {
          console.error('Error fetching API key:', error);
          toast.error('Failed to load Google Maps API key');
          return;
        }

        if (data?.apiKey) {
          setApiKey(data.apiKey);
        } else {
          console.error('No API key returned from edge function');
          toast.error('Google Maps API key not configured');
        }
      } catch (error) {
        console.error('Error calling edge function:', error);
        toast.error('Failed to fetch Google Maps configuration');
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchApiKey();
  }, []);

  // Initialize Google Maps
  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['geometry', 'places']
    });

    loader.load().then(() => {
      if (!mapRef.current) return;
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 42.3152, lng: -71.0685 }, // Dorchester, Boston area
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
      console.log('Google Maps loaded successfully');
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
      toast.error('Failed to load Google Maps');
    });
  }, [apiKey]);

  // Add markers for filtered events
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers for filtered events
    filteredEvents.forEach((event) => {
      // Generate coordinates around Dorchester/Boston area for demo purposes
      const lat = 42.3152 + (Math.random() - 0.5) * 0.08;
      const lng = -71.0685 + (Math.random() - 0.5) * 0.08;

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: event.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#8b5cf6" stroke="white" stroke-width="3"/>
              <circle cx="20" cy="20" r="8" fill="white"/>
              <text x="20" y="25" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="bold">$${event.price}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });

      // Create info window content
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #374151;">${event.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6B7280;">${event.description.substring(0, 100)}...</p>
            <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
              <strong>📅 ${new Date(event.date).toLocaleDateString()}</strong>
            </div>
            <div style="margin: 4px 0; font-size: 12px; color: #8B5CF6;">
              <strong>🕒 ${event.time}</strong>
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
        `
      });

      marker.addListener('click', () => {
        // Close any open info windows
        markersRef.current.forEach(m => {
          if ((m as any).infoWindow) {
            (m as any).infoWindow.close();
          }
        });
        
        infoWindow.open(mapInstanceRef.current, marker);
        (marker as any).infoWindow = infoWindow;
        setSelectedEvent(event);
        mapInstanceRef.current?.panTo({ lat, lng });
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (filteredEvents.length > 0 && markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      mapInstanceRef.current?.fitBounds(bounds);
    }
  }, [filteredEvents, mapLoaded]);

  const handleEventClick = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  if (isLoadingApiKey) {
    return (
      <div className="grid grid-cols-1 gap-6 h-[600px]">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border border-purple-200 flex items-center justify-center p-8">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Loading Google Maps</h3>
            <p className="text-gray-600">Fetching configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="grid grid-cols-1 gap-6 h-[600px]">
        <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl border border-red-200 flex items-center justify-center p-8">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Google Maps Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Google Maps API key is not configured. Please set the GOOGLE_MAPS_API_KEY in your Supabase environment variables.
            </p>
            <p className="text-sm text-gray-500">
              You can get a Google Maps API key from the Google Cloud Console and add it to your Supabase project's Edge Function secrets.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Container */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-lg">
        <div ref={mapRef} className="w-full h-full rounded-2xl" />
      </div>

      {/* Event Details Sidebar */}
      <div className="space-y-4 overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800">
          {filteredEvents.length} Events Found
        </h3>
        
        {filteredEvents.map((event) => (
          <Card 
            key={event.id} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
              selectedEvent?.id === event.id 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-purple-100 hover:border-purple-200'
            }`}
            onClick={() => handleEventClick(event)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {event.category}
                </Badge>
                <span className="text-sm font-bold text-purple-600">${event.price}</span>
              </div>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {event.attendees_count || 0} attending
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsMap;
