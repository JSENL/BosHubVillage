
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
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
    filteredEvents.forEach((event, index) => {
      // Generate coordinates around Dorchester/Boston area for demo purposes
      const lat = 42.3152 + (Math.random() - 0.5) * 0.1;
      const lng = -71.0685 + (Math.random() - 0.5) * 0.1;

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: event.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#8b5cf6" stroke="white" stroke-width="2"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      marker.addListener('click', () => {
        setSelectedEvent(event);
        mapInstanceRef.current?.panTo({ lat, lng });
      });

      markersRef.current.push(marker);
    });
  }, [filteredEvents, mapLoaded]);

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
            <p className="text-gray-600">
              Google Maps API key is not configured. Please contact the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Container */}
      <div className="lg:col-span-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border border-purple-200 overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
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
            onClick={() => setSelectedEvent(event)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {event.category}
                </Badge>
                <span className="text-sm text-gray-500">${event.price}</span>
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
