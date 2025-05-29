
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockEvents } from '@/data/mockEvents';

interface EventsCalendarProps {
  searchQuery: string;
  selectedCategory: string;
}

const EventsCalendar = ({ searchQuery, selectedCategory }: EventsCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Filter events based on search and category
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get events for selected date
  const eventsForSelectedDate = filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.toDateString() === selectedDate?.toDateString();
  });

  // Get dates that have events
  const eventDates = filteredEvents.map(event => new Date(event.date));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-center">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="rounded-md border-0"
            modifiers={{
              hasEvent: eventDates,
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: '#e879f9',
                color: 'white',
                fontWeight: 'bold',
              }
            }}
          />
          <div className="mt-4 text-sm text-gray-600 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded"></div>
              <span>Days with events</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events for Selected Date */}
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle>
            Events on {selectedDate?.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventsForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No events scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {eventsForSelectedDate.map((event) => (
                <Card key={event.id} className="border-purple-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {event.category}
                      </Badge>
                      <span className="font-bold text-purple-600">${event.price}</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        {event.location}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsCalendar;
