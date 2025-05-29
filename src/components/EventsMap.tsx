
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Users } from 'lucide-react';
import { mockEvents } from '@/data/mockEvents';

interface EventsMapProps {
  searchQuery: string;
  selectedCategory: string;
}

const EventsMap = ({ searchQuery, selectedCategory }: EventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Filter events based on search and category
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (!mapRef.current) return;

    // For now, we'll create a placeholder map interface
    // In a real implementation, you would integrate with Google Maps API
    console.log('Map would be initialized here with filtered events:', filteredEvents);
  }, [filteredEvents]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Map Container */}
      <div className="lg:col-span-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border border-purple-200 flex items-center justify-center relative overflow-hidden">
        <div ref={mapRef} className="w-full h-full flex items-center justify-center">
          <div className="text-center p-8">
            <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Interactive Map</h3>
            <p className="text-gray-600 mb-4">
              Google Maps integration will display events as interactive markers
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
              {filteredEvents.slice(0, 4).map((event) => (
                <div 
                  key={event.id}
                  className="bg-white/80 p-2 rounded-lg cursor-pointer hover:bg-white transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                  <p className="text-xs text-center truncate">{event.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                  {event.attendees} attending
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
