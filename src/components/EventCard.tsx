import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Users, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { eventDetailPath } from '@/lib/eventUrl';
import { useTranslatedField } from '@/hooks/useTranslatedField';
import { useCardLocale } from '@/hooks/useCardLocale';
import { CategoryIcon, CategoryHero } from '@/components/common/CategoryIcon';
import SponsoredBadge from '@/components/common/SponsoredBadge';
import { ContentListRowLayout } from '@/components/common/ContentListRowLayout';
import { richTextPlainText } from '@/lib/richText';

type TranslationsObject = Record<string, string>;

interface Event {
  id: string;
  slug?: string;
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
  image_url?: string | null;
  title_translations?: TranslationsObject;
  description_translations?: TranslationsObject;
  location_translations?: TranslationsObject;
  category_translations?: TranslationsObject;
}

interface EventCardProps {
  event: Event;
  viewMode: 'grid' | 'list' | 'map';
  isHighlighted?: boolean;
  /** List row density (optional; defaults to comfortable) */
  listCompact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  viewMode,
  isHighlighted = false,
  listCompact = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getTranslatedText } = useTranslatedField();
  const { formatDate } = useCardLocale();

  const handleViewDetails = () => {
    navigate(eventDetailPath({ slug: event.slug, id: event.id }));
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

  if (viewMode === 'map') {
    return null;
  }

  if (viewMode === 'list') {
    const snippet = richTextPlainText(getTranslatedText(event.description, event.description_translations)) || '\u2014';
    const loc = getTranslatedText(event.location, event.location_translations);
    const title = getTranslatedText(event.title, event.title_translations);
    const category = getTranslatedText(event.category, event.category_translations);
    const priceLabel = event.price === 0 ? t('cards.free') : `$${event.price}`;

    const meta = (
      <>
        <span className="inline-flex min-w-0 max-w-full items-center gap-1">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          <span className="truncate">
            {formatDate(event.date)}
            {formatTimeRange(event.start_time, event.end_time)
              ? ` · ${formatTimeRange(event.start_time, event.end_time)}`
              : ''}
          </span>
        </span>
        {loc ? (
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate break-all">{loc}</span>
          </span>
        ) : null}
        {event.max_attendees ? (
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <Users className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{formatAttendeesText(event.max_attendees)}</span>
          </span>
        ) : null}
      </>
    );

    return (
      <ContentListRowLayout
        id={`event-${event.id}`}
        compact={listCompact}
        ariaLabel={`${t('itemTypes.events')}: ${title}`}
        onClick={handleViewDetails}
        className={isHighlighted ? 'ring-2 ring-destructive/40 ring-offset-1' : undefined}
        leftVisual={
          <CategoryHero
            category={event.category}
            type="event"
            height="h-full min-h-full"
            className="min-h-[inherit] w-full"
            imageUrl={event.image_url}
          />
        }
        sponsored={event.is_sponsored ? <SponsoredBadge size="sm" /> : undefined}
        badges={
          <>
            <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wide">
              {t('itemTypes.events')}
            </Badge>
            <Badge variant="secondary" className="max-w-[10rem] truncate text-xs">
              <CategoryIcon category={event.category} type="event" size="sm" className="mr-1 shrink-0" />
              <span className="truncate">{category}</span>
            </Badge>
          </>
        }
        title={title}
        snippet={snippet}
        meta={meta}
        trailing={
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end">
            <span className="text-sm font-semibold text-primary whitespace-nowrap">{priceLabel}</span>
            <ChevronRight
              className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </div>
        }
      />
    );
  }

  return (
    <Card 
      id={`event-${event.id}`}
      className={`${cardClassName} h-full`}
      onClick={handleViewDetails}
    >
      {/* Category Hero */}
      <CategoryHero category={event.category} type="event" imageUrl={event.image_url} />
      
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
          {richTextPlainText(getTranslatedText(event.description, event.description_translations))}
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
