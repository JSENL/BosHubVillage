
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import EventDetailsModal from './EventDetailsModal';

interface EventsListProps {
  searchQuery: string;
  selectedCategory: string;
  events: Event[];
}

const EventsList = ({ searchQuery, selectedCategory, events }: EventsListProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {filteredEvents.length} Events Found
          </h2>
        </div>

        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-purple-100">
              <div className="md:flex">
                <div className="md:w-1/4">
                  <div className="h-48 md:h-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-3xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-3/4 p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {event.category}
                      </Badge>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-purple-600">${event.price}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        <div>
                          <div>{new Date(event.date).toLocaleDateString()}</div>
                          <div>{event.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        <div>{event.location}</div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-purple-500" />
                        <div>{event.attendees_count || 0} attending</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        onClick={() => handleEventClick(event)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        View Details
                      </Button>
                      <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <EventDetailsModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default EventsList;
