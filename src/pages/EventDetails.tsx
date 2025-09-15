import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, DollarSign, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEvents } from '@/hooks/useEvents';
import EventComments from '@/components/EventComments';
import { Navigation } from '@/components/Navigation';
import { SocialShare } from '@/components/SocialShare';
import { CalendarShare } from '@/components/CalendarShare';
import { EventRegistrationForm } from '@/components/EventRegistrationForm';
import { useState } from 'react';

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const event = events.find(e => e.id === eventId);

  if (loading) {
    return "Loading...";
  }

  if (!event) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Event Not Found</h3>
              <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>

          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{event.category}</Badge>
                    <Badge variant="outline">
                      {event.price === 0 ? "Free" : `$${event.price}`}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString('en-US')} at {event.start_time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>

                    {event.max_attendees && (
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Up to {event.max_attendees} attendees</span>
                      </div>
                    )}
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8">
            <EventComments eventId={event.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;