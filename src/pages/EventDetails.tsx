
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEvents } from '@/hooks/useEvents';
import EventComments from '@/components/EventComments';

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, loading } = useEvents();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-purple-600 hover:bg-purple-50"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Event Hero Section */}
          <Card className="border-purple-100 mb-8">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm">
                  {event.category}
                </Badge>
                <div className="flex items-center text-2xl font-bold text-purple-600">
                  <DollarSign className="h-6 w-6 mr-1" />
                  {event.price}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">{event.title}</h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{event.description}</p>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-500" />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-gray-600">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-500" />
                  <div>
                    <div className="font-semibold text-gray-800">Location</div>
                    <div className="text-gray-600">{event.location}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-500" />
                  <div>
                    <div className="font-semibold text-gray-800">Attendees</div>
                    <div className="text-gray-600">
                      {event.attendees_count || 0} attending
                      {event.max_attendees && (
                        <span> / {event.max_attendees} max</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Register for Event
                </Button>
                <Button variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  Share Event
                </Button>
                <Button variant="outline" size="lg" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                  Add to Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="border-purple-100">
            <CardContent className="p-8">
              <EventComments eventId={event.id} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
