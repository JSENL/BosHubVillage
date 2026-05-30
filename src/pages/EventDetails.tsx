import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, DollarSign, ExternalLink, Settings, Mail, Phone, MessageCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Event, useEvents } from '@/hooks/useEvents';
import EventComments from '@/components/EventComments';
import { Navigation } from '@/components/Navigation';
import { SocialShare } from '@/components/SocialShare';
import { CalendarShare } from '@/components/CalendarShare';
import { EventRegistrationForm } from '@/components/EventRegistrationForm';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { LinkedNewsSection } from '@/components/content/LinkedNewsSection';
import { EventCreatorInfo } from '@/components/events/EventCreatorInfo';
import { eventDetailPath } from '@/lib/eventUrl';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useTranslatedField } from '@/hooks/useTranslatedField';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { DetailPageLoading } from '@/components/common/DetailPageLoading';
import { EventHeroImageEditor } from '@/components/events/EventHeroImageEditor';
import { supabase } from '@/integrations/supabase/client';
import { formatDateOnly, formatTimeRange } from '@/utils/common/dateUtils';
import { RichTextContent } from '@/components/RichTextContent';
import { richTextPlainText } from '@/lib/richText';
import { EventStructuredData } from '@/components/seo/StructuredData';
import { useSsrPrefetch } from '@/contexts/SsrPrefetchContext';
import { normalizeEventRow, slugifyTitle, UUID_RE } from '@/lib/ssr/eventNormalize';

const EventDetails = () => {
  const { eventSlug } = useParams<{ eventSlug: string }>();
  const navigate = useNavigate();
  const ssrPrefetch = useSsrPrefetch();
  const ssrEvent = ssrPrefetch?.type === 'event' ? ssrPrefetch.data : null;
  const { events, loading: eventsLoading } = useEvents();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { getTranslatedText } = useTranslatedField();
  const [resolvedEvent, setResolvedEvent] = useState<Event | null>(ssrEvent);
  const [resolvingDirect, setResolvingDirect] = useState(false);

  const param = eventSlug ?? '';
  const listEvent = useMemo(
    () =>
      param
        ? events.find((e) => e.slug === param) ?? events.find((e) => e.id === param)
        : undefined,
    [events, param]
  );

  useEffect(() => {
    if (!param || eventsLoading) return;
    if (ssrEvent) return;
    if (listEvent) {
      setResolvedEvent(listEvent);
      return;
    }
    setResolvedEvent(null);

    let cancelled = false;

    const resolveDirect = async () => {
      setResolvingDirect(true);
      try {
        // 1) Live events table (canonical source, includes slugs)
        const liveBySlug = await supabase
          .from('events')
          .select('*')
          .eq('slug', param)
          .maybeSingle();

        if (!cancelled && liveBySlug.data) {
          setResolvedEvent(normalizeEventRow(liveBySlug.data));
          return;
        }

        if (UUID_RE.test(param)) {
          const liveById = await supabase
            .from('events')
            .select('*')
            .eq('id', param)
            .maybeSingle();
          if (!cancelled && liveById.data) {
            setResolvedEvent(normalizeEventRow(liveById.data));
            return;
          }
        }

        // 2) Archived events table fallback
        if (UUID_RE.test(param)) {
          const pastById = await supabase
            .from('past_events')
            .select('*')
            .eq('id', param)
            .maybeSingle();
          if (!cancelled && pastById.data) {
            setResolvedEvent(normalizeEventRow(pastById.data, slugifyTitle(String(pastById.data.title ?? 'event'))));
            return;
          }
        }

        // 3) Match old archived rows by slugified title
        const titleSearch = `%${param.replace(/-/g, '%')}%`;
        const pastCandidates = await supabase
          .from('past_events')
          .select('*')
          .ilike('title', titleSearch)
          .order('date', { ascending: false })
          .limit(40);

        const match = (pastCandidates.data ?? []).find(
          (row) => slugifyTitle(String(row.title ?? '')) === param
        );
        if (!cancelled) {
          setResolvedEvent(
            match ? normalizeEventRow(match as Record<string, any>, slugifyTitle(String(match.title ?? 'event'))) : null
          );
        }
      } finally {
        if (!cancelled) setResolvingDirect(false);
      }
    };

    void resolveDirect();

    return () => {
      cancelled = true;
    };
  }, [listEvent, eventsLoading, param, ssrEvent]);

  const event = listEvent ?? resolvedEvent ?? undefined;

  useEffect(() => {
    if (!event?.slug || !param) return;
    if (param === event.id && event.slug !== event.id) {
      navigate(eventDetailPath({ slug: event.slug, id: event.id }), { replace: true });
    }
  }, [event, param, navigate]);
  const displayTitle = event ? getTranslatedText(event.title, event.translations?.title) : undefined;
  const displayDescription = event?.description
    ? richTextPlainText(
        getTranslatedText(event.description, event.translations?.description) ?? event.description
      ).slice(0, 160)
    : undefined;
  useDocumentHead(displayTitle, displayDescription, {
    path: event ? eventDetailPath({ slug: event.slug, id: event.id }) : undefined,
    imageUrl: event?.image_url,
  });

  const isEventCreator = user && event && event.created_by === user.id;
  const canEditLinks = isEventCreator || isAdmin;

  const waitingForEvent =
    !event && ((eventsLoading && !ssrEvent) || resolvingDirect);

  if (waitingForEvent) {
    return <DetailPageLoading />;
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
      <EventStructuredData
        event={{
          id: event.id,
          slug: event.slug,
          title: displayTitle || event.title,
          description: event.description,
          date: event.date,
          start_time: event.start_time,
          end_time: event.end_time,
          location: event.location,
          address: event.address,
          price: event.price,
          image_url: event.image_url,
        }}
      />
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('pages.backToEvents')}
            </Button>
            
            {isAdmin && (
              <Button asChild variant="outline">
                <Link to="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Link>
              </Button>
            )}
          </div>

          <EventHeroImageEditor
            eventId={event.id}
            eventTitle={event.title}
            imageUrl={event.image_url}
            coverZoom={event.cover_zoom}
            coverFocusX={event.cover_focus_x}
            coverFocusY={event.cover_focus_y}
            canEdit={!!canEditLinks}
          />

          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">
                {getTranslatedText(event.title, (event as any).title_translations)}
              </h1>
              <BookmarkButton 
                itemType="event" 
                itemId={event.id} 
                size="lg"
                showText={true}
              />
            </div>
            <EventCreatorInfo creatorId={event.created_by} />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">
                      {getTranslatedText(event.category, (event as any).category_translations)}
                    </Badge>
                    <Badge variant="outline">
                      {event.price === 0 ? t('cards.free') : `$${event.price}`}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {formatDateOnly(event.date, 'en-US')} at{" "}
                        {formatTimeRange(event.start_time || undefined, event.end_time || undefined) || 'Time TBD'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{getTranslatedText(event.location, (event as any).location_translations)}</span>
                    </div>

                    {event.address && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 opacity-50" />
                        <span className="text-sm">{event.address}</span>
                      </div>
                    )}

                    {event.max_attendees && (
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{t('pages.upToAttendees', { count: event.max_attendees })}</span>
                      </div>
                    )}
                  </div>

                  <div className="max-w-none">
                    <h3 className="text-lg font-semibold mb-2">{t('pages.description')}</h3>
                    <RichTextContent
                      html={getTranslatedText(
                        event.description,
                        (event as any).description_translations
                      )}
                    />
                  </div>

                  {/* Add to Calendar & Share Section */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                    <CalendarShare
                      title={event.title}
                      description={richTextPlainText(event.description || '')}
                      startDate={event.date}
                      startTime={event.start_time || undefined}
                      endTime={event.end_time || undefined}
                      location={event.location}
                    />
                    <SocialShare
                      title={event.title}
                      description={richTextPlainText(event.description || '')}
                      url={`${window.location.origin}${eventDetailPath({ slug: event.slug, id: event.id })}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with Registration */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">{t('pages.eventActions', 'Event Actions')}</h3>
                  
                  {event.registration_required && (
                    <Button 
                      className="w-full" 
                      onClick={() => setShowRegistrationForm(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {t('pages.registerForEvent', 'Register for Event')}
                    </Button>
                  )}

                  {event.website_link && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(event.website_link!, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t('pages.visitWebsite', 'Visit Website')}
                    </Button>
                  )}

                  {/* Contact (message, phone, email, or website) */}
                  {(event.contact_type === 'message' || event.contact_type === 'phone' || event.contact_type === 'email' || event.contact_type === 'website') && (
                    <div className="pt-2 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">{t('pages.contact', 'Contact')}</h4>
                      {event.contact_type === 'message' && (
                        <Button
                          variant="outline"
                          className="w-full"
                          asChild
                        >
                          <Link to={`/contact-admin?subject=Event: ${encodeURIComponent(event.title)}&eventId=${event.id}`}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {t('pages.messageThroughSystem', 'Message through our system')}
                          </Link>
                        </Button>
                      )}
                      {event.contact_type === 'phone' && event.contact_value && (
                        <Button
                          variant="outline"
                          className="w-full"
                          asChild
                        >
                          <a href={`tel:${event.contact_value.trim()}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            {event.contact_value}
                          </a>
                        </Button>
                      )}
                      {event.contact_type === 'email' && event.contact_value && (
                        <Button
                          variant="outline"
                          className="w-full"
                          asChild
                        >
                          <a href={`mailto:${event.contact_value.trim()}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            {event.contact_value}
                          </a>
                        </Button>
                      )}
                      {event.contact_type === 'website' && event.contact_value && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(event.contact_value!.trim().startsWith('http') ? event.contact_value! : `https://${event.contact_value}`, '_blank')}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          {t('pages.visitLink', 'Visit link')}
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{event.price === 0 ? t('cards.free') : `$${event.price}`}</span>
                    </div>
                    {event.is_recurring && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{t('pages.recurringEvent', 'Recurring Event')}: {event.recurring_pattern}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Registration Form Modal */}
          <EventRegistrationForm
            eventId={event.id}
            eventTitle={event.title}
            isOpen={showRegistrationForm}
            onClose={() => setShowRegistrationForm(false)}
          />

          {/* Related culture section */}
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