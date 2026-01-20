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
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { LinkedNewsSection } from '@/components/content/LinkedNewsSection';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();

  const event = events.find(e => e.id === eventId);
  
  // Check if user is the event creator
  const isEventCreator = user && event && event.created_by === user.id;
  const canEditLinks = isEventCreator || isAdmin;

  if (loading) {
    return t('common.loading');
  }

  if (!event) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{t('pages.eventNotFound')}</h3>
              <p className="text-gray-600 mb-4">{t('pages.eventNotFoundDesc')}</p>
              <Button onClick={() => navigate('/')}>{t('pages.backToHome')}</Button>
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
            {t('pages.backToEvents')}
          </Button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <BookmarkButton 
              itemType="event" 
              itemId={event.id} 
              size="lg"
              showText={true}
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{event.category}</Badge>
                    <Badge variant="outline">
                      {event.price === 0 ? t('cards.free') : `$${event.price}`}
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
                        <span>{t('pages.upToAttendees', { count: event.max_attendees })}</span>
                      </div>
                    )}
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">{t('pages.description')}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related News Section */}
          <div className="mt-8">
            <LinkedNewsSection 
              contentType="event" 
              contentId={event.id}
              canEdit={canEditLinks}
            />
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