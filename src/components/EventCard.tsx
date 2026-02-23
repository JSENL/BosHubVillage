import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, DollarSign, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useTranslatedField } from '@/hooks/useTranslatedField';
import { CategoryIcon, CategoryHero } from '@/components/common/CategoryIcon';
import SponsoredBadge from '@/components/common/SponsoredBadge';

type TranslationsObject = Record<string, string>;

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number;
  max_attendees?: number;
  is_sponsored?: boolean;
  title_translations?: TranslationsObject;
  description_translations?: TranslationsObject;
  location_translations?: TranslationsObject;
  category_translations?: TranslationsObject;
}

interface EventCardProps {
  event: Event;
  viewMode: 'grid' | 'list' | 'map';
  isHighlighted?: boolean;
}

const localeMap: Record<string, string> = {
  en: 'en-US',
  es: 'es',
  fr: 'fr-FR',
  vi: 'vi-VN',
  pt: 'pt-BR',
};

export const EventCard: React.FC<EventCardProps> = ({ event, viewMode, isHighlighted = false }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { getTranslatedText } = useTranslatedField();
  const locale = localeMap[i18n.language] || 'en-US';

  const handleViewDetails = () => {
    navigate(`/event/${event.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    const formatTime = (time: string) => {
      if (!time) return '';
      
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    if (!startTime && !endTime) return '';
    if (startTime && endTime) {
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }
    return formatTime(startTime) || formatTime(endTime);
  };

  const cardClassName = `
    bg-card border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden
    ${isHighlighted ? 'ring-2 ring-destructive ring-opacity-75' : ''}
    ${event.is_sponsored ? 'ring-2 ring-amber-400/50' : ''}
  `;

  // Generate random rating for Yelp-like appearance
  const rating = Math.floor(Math.random() * 2) + 4;
  const reviewCount = Math.floor(Math.random() * 500) + 50;

  const formatAttendeesText = (maxAttendees: number) => {
    return t('cards.upToAttendees', { count: maxAttendees });
  };

  if (viewMode === 'list') {
    return (
      <Card 
        id={`event-${event.id}`}
        className={cardClassName}
        onClick={handleViewDetails}
      >
        <CardContent className="p-0">
          <div className="flex">
            {/* Category Hero for list view */}
            <CategoryHero 
              category={event.category} 
              type="event" 
              height="h-auto"
              className="w-32 flex-shrink-0"
            />
            
            <div className="flex-1 p-6">
              {event.is_sponsored && (
                <div className="mb-3">
                  <SponsoredBadge size="md" />
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="text-xl font-bold text-foreground hover:text-primary mb-1 line-clamp-2 break-words">
                    {getTranslatedText(event.title, event.title_translations)}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < rating ? 'text-secondary fill-current' : 'text-muted'}`} 
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2 truncate">{t('cards.reviews', { count: reviewCount })}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant="secondary" className="mb-2">
                    <CategoryIcon category={event.category} type="event" size="sm" className="mr-1" />
                    <span className="truncate max-w-20">{getTranslatedText(event.category, event.category_translations)}</span>
                  </Badge>
                  <div className="text-lg font-bold text-destructive">
                    {event.price === 0 ? t('cards.free') : `$${event.price}`}
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2 break-words">
                {getTranslatedText(event.description, event.description_translations)}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center min-w-0">
                  <Calendar className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  <span className="truncate">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center min-w-0">
                  <span className="text-xs truncate">{formatTimeRange(event.start_time, event.end_time)}</span>
                </div>
                <div className="flex items-center min-w-0">
                  <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                  <span className="truncate break-all min-w-0">{getTranslatedText(event.location, event.location_translations)}</span>
                </div>
                {event.max_attendees && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{formatAttendeesText(event.max_attendees)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      id={`event-${event.id}`}
      className={`${cardClassName} h-full`}
      onClick={handleViewDetails}
    >
      {/* Category Hero */}
      <CategoryHero category={event.category} type="event" />
      
      <CardHeader className="pb-2 pt-3">
        {event.is_sponsored && (
          <div className="mb-2">
            <SponsoredBadge />
          </div>
        )}
        <div className="flex items-start justify-between mb-1">
          <Badge variant="secondary" className="text-xs">
            <CategoryIcon category={event.category} type="event" size="sm" className="mr-1" />
            {getTranslatedText(event.category, event.category_translations)}
          </Badge>
          <div className="text-sm font-bold text-destructive">
            {event.price === 0 ? t('cards.free') : `$${event.price}`}
          </div>
        </div>
        <CardTitle className="text-sm text-foreground hover:text-primary line-clamp-2 break-words">
          {getTranslatedText(event.title, event.title_translations)}
        </CardTitle>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < rating ? 'text-secondary fill-current' : 'text-muted'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{t('cards.reviews', { count: reviewCount })}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <CardDescription className="mb-2 line-clamp-2 text-muted-foreground text-xs break-words">
          {getTranslatedText(event.description, event.description_translations)}
        </CardDescription>
        <div className="space-y-1 text-xs">
          <div className="flex items-center text-muted-foreground min-w-0">
            <Calendar className="h-3 w-3 mr-2 text-primary flex-shrink-0" />
            <span className="truncate">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-muted-foreground min-w-0 ml-5">
            <span className="text-xs truncate">{formatTimeRange(event.start_time, event.end_time)}</span>
          </div>
          <div className="flex items-center text-muted-foreground min-w-0">
            <MapPin className="h-3 w-3 mr-2 text-primary flex-shrink-0" />
            <span className="truncate break-all min-w-0">{getTranslatedText(event.location, event.location_translations)}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center text-muted-foreground">
              <Users className="h-3 w-3 mr-2 text-primary" />
              <span>{formatAttendeesText(event.max_attendees)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
