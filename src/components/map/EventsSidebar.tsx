
import { Event } from '@/hooks/useEvents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users } from 'lucide-react';

interface EventsSidebarProps {
  filteredEvents: Event[];
  selectedEvent: Event | null;
  onEventClick: (event: Event) => void;
}

export const EventsSidebar = ({ filteredEvents, selectedEvent, onEventClick }: EventsSidebarProps) => (
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
        onClick={() => onEventClick(event)}
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
);
