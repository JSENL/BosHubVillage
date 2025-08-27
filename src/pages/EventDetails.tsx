
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { useContentTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const { getTranslatedField, currentLanguage } = useContentTranslation();
  const { t } = useTranslation();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('common.eventNotFound')}</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.backToEvents')}
          </Button>
        </div>
      </div>
    );
  }

  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime && !endTime) return 'Time TBD';
    
    const formatTime = (timeStr: string) => {
      if (!timeStr) return '';
      
      if (currentLanguage === 'en') {
        // Convert 24-hour to 12-hour format for English
        const [hours, minutes] = timeStr.split(':');
        const hour24 = parseInt(hours);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const ampm = hour24 >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
      }
      
      return timeStr; // Keep 24-hour format for other languages
    };
    
    if (startTime && endTime) {
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }
    return formatTime(startTime || endTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Event Hero Section */}
          <Card className="border-purple-100 mb-8">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-sm">
                  {getTranslatedField(event, 'category', 'events')}
                </Badge>
                <div className="flex items-center text-2xl font-bold text-purple-600">
                  <DollarSign className="h-6 w-6 mr-1" />
                  {event.price}
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">{getTranslatedField(event, 'title', 'events')}</h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">{getTranslatedField(event, 'description', 'events')}</p>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-500" />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {new Date(event.date).toLocaleDateString(currentLanguage === 'en' ? 'en-US' : currentLanguage, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-gray-600">{formatTimeRange(event.start_time, event.end_time)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-500" />
                  <div>
                    <div className="font-semibold text-gray-800">{t('common.location')}</div>
                    <div className="text-gray-600">{getTranslatedField(event, 'location', 'events')}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-500" />
                  <div>
                    <div className="font-semibold text-gray-800">{t('common.attendees')}</div>
                    <div className="text-gray-600">
                      {event.attendees_count || 0} {t('common.attending')}
                      {event.max_attendees && (
                        <span> / {event.max_attendees} {t('common.max')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Link */}
              {event.website_link && (
                <div className="mb-6">
                  <a
                    href={event.website_link.startsWith('http') ? event.website_link : `https://${event.website_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('common.visitEventWebsite')}
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {event.registration_required && (
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={() => setShowRegistrationForm(true)}
                  >
                    {t('common.registerForEvent')}
                  </Button>
                )}
                <SocialShare 
                  title={event.title}
                  description={event.description || `Join us for ${event.title} on ${new Date(event.date).toLocaleDateString()}`}
                  url={window.location.href}
                  hashtags={[event.category.toLowerCase().replace(/\s+/g, ''), 'event', 'community']}
                />
                <CalendarShare
                  title={event.title}
                  description={event.description || `Join us for ${event.title}`}
                  startDate={event.date}
                  startTime={event.start_time}
                  endTime={event.end_time}
                  location={event.location}
                />
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="border-purple-100">
            <CardContent className="p-8">
              <EventComments eventId={event.id} />
            </CardContent>
          </Card>
          
          {/* Registration Form Modal */}
          {event.registration_required && (
            <EventRegistrationForm
              eventId={event.id}
              eventTitle={event.title}
              isOpen={showRegistrationForm}
              onClose={() => setShowRegistrationForm(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
