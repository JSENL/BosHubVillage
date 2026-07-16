import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Star, Building, Newspaper, Wrench, ChevronRight, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnifiedItem } from '@/types/unifiedItem';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import type { BookmarkItemType } from '@/hooks/useBookmarks';
import { useNavigate } from 'react-router-dom';
import { eventDetailPath } from '@/lib/eventUrl';
import { useTranslatedField } from '@/hooks/useTranslatedField';
import { useCardLocale } from '@/hooks/useCardLocale';
import { ContentListRowLayout } from '@/components/common/ContentListRowLayout';
import { CategoryHero, CategoryIcon } from '@/components/common/CategoryIcon';
import SponsoredBadge from '@/components/common/SponsoredBadge';
import { richTextPlainText } from '@/lib/richText';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface UnifiedItemCardProps {
  item: UnifiedItem;
  viewMode: 'grid' | 'list';
  isHighlighted?: boolean;
  /** Row density for list view (from home filters) */
  listCompact?: boolean;
  /** When list rows use split meta column on large screens */
  listSplitMeta?: boolean;
}

export const UnifiedItemCard: React.FC<UnifiedItemCardProps> = ({ 
  item, 
  viewMode, 
  isHighlighted = false,
  listCompact = false,
  listSplitMeta = true,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getTranslatedText } = useTranslatedField();
  const { formatDate } = useCardLocale();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const handleViewDetails = () => {
    addToRecentlyViewed({
      itemType:
        item.type === 'local-service'
          ? 'local_service'
          : item.type === 'past-event'
            ? 'event'
            : (item.type as BookmarkItemType),
      itemId: item.id,
    });

    if (item.type === 'event' || item.type === 'past-event') {
      navigate(eventDetailPath({ slug: item.slug, id: item.id }));
      return;
    }
    const routePath = item.type === 'local-service' ? 'local-resource' : 
                     item.type === 'business' ? 'business' : item.type;
    navigate(`/${routePath}/${item.id}`);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeRange = (startTime?: string, endTime?: string) => {
    if (!startTime && !endTime) return '';
    if (startTime && endTime) {
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    }
    return formatTime(startTime || endTime || '');
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'event':
      case 'past-event':
        return <Calendar className="h-6 w-6 mx-auto mb-1" />;
      case 'news':
        return <Newspaper className="h-6 w-6 mx-auto mb-1" />;
      case 'business':
        return <Building className="h-6 w-6 mx-auto mb-1" />;
      case 'local-service':
        return <Wrench className="h-6 w-6 mx-auto mb-1" />;
      default:
        return <Calendar className="h-6 w-6 mx-auto mb-1" />;
    }
  };

  const getTypeColor = () => {
    const colors = {
      event: 'from-red-500 to-red-600',
      'past-event': 'from-red-500 to-red-600',
      news: 'from-blue-500 to-blue-600',
      business: 'from-green-500 to-green-600',
      'local-service': 'from-logo-coral-orange to-logo-coral-orange/90'
    };
    return colors[item.type] || 'from-gray-500 to-gray-600';
  };

  const getTypeLabel = () => {
    const labels = {
      event: t('itemTypes.events'),
      'past-event': t('itemTypes.events'),
      news: t('itemTypes.news'),
      business: t('itemTypes.businesses'),
      'local-service': t('itemTypes.localresources')
    };
    return labels[item.type] || 'View';
  };

  const cardClassName = `
    bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer
    w-full min-w-0 overflow-hidden
    ${isHighlighted ? 'ring-2 ring-caribbean-teal ring-opacity-75' : ''}
  `;

  // Generate random rating for consistent appearance
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 200) + 25;

  const getDisplayTitle = () => {
    const originalTitle = item.title || item.name || '';
    const translations = item.title_translations || item.name_translations;
    return getTranslatedText(originalTitle, translations);
  };

  const getDisplayDescription = () => {
    const originalDesc = item.description || item.content || '';
    const translations = item.description_translations || item.content_translations;
    return getTranslatedText(originalDesc, translations);
  };

  const getDisplayLocation = () => {
    const originalLoc = item.location || item.address || '';
    const translations = item.location_translations || item.address_translations;
    return getTranslatedText(originalLoc, translations);
  };

  const getDisplayCategory = () => {
    const originalCat = item.category || item.business_type || '';
    return getTranslatedText(originalCat, item.category_translations);
  };

  const heroCategory =
    item.type === 'news'
      ? item.category?.trim()
        ? item.category
        : 'news'
      : item.category || item.business_type || 'community';

  const heroType =
    item.type === 'event' || item.type === 'past-event'
      ? 'event'
      : item.type === 'news'
        ? 'news'
        : item.type === 'business'
          ? 'business'
          : 'local-service';

  const listSnippet = richTextPlainText(getDisplayDescription()) || '\u2014';

  const neighborhoodLine = () => {
    const n = item.neighborhoods;
    const v = item.villages;
    const parts: string[] = [];
    if (typeof n === 'string' && n.trim()) parts.push(n.trim());
    if (v) {
      if (Array.isArray(v)) parts.push(v.filter(Boolean).join(', '));
      else if (typeof v === 'string' && v.trim()) parts.push(v.trim());
    }
    return parts.join(' · ');
  };

  if (viewMode === 'list') {
    const loc = getDisplayLocation();
    const hood = neighborhoodLine();

    const meta = (
      <>
        {(item.type === 'event' || item.type === 'past-event') && item.date ? (
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">
              {formatDate(item.date)}
              {formatTimeRange(item.start_time, item.end_time)
                ? ` · ${formatTimeRange(item.start_time, item.end_time)}`
                : ''}
            </span>
          </span>
        ) : null}
        {item.type === 'news' && item.date ? (
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{formatDate(item.date)}</span>
          </span>
        ) : null}
        {loc ? (
          <span className="inline-flex min-w-0 max-w-full items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{loc}</span>
          </span>
        ) : null}
        {item.type === 'news' && item.source?.trim() ? (
          <span className="max-w-full truncate">
            {t('cards.source')}: {item.source}
          </span>
        ) : null}
        {hood && (item.type === 'business' || item.type === 'local-service') ? (
          <span className="max-w-full truncate">{hood}</span>
        ) : null}
        <span className="inline-flex min-w-0 max-w-full items-center gap-1 text-primary">
          <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">Open to comment</span>
        </span>
      </>
    );

    const priceLabel = (() => {
      if (item.type === 'event' || item.type === 'past-event') {
        if (item.price === undefined || item.price === null) return null;
        return Number(item.price) === 0 ? t('cards.free') : `$${item.price}`;
      }
      if (item.price !== undefined && item.price !== null && Number(item.price) > 0) {
        return `$${item.price}`;
      }
      return null;
    })();

    const rowAria = `${getTypeLabel()}: ${getDisplayTitle()}`;

    return (
      <ContentListRowLayout
        id={`item-${item.id}`}
        compact={listCompact}
        splitMeta={listSplitMeta}
        ariaLabel={rowAria}
        onClick={handleViewDetails}
        className={isHighlighted ? 'ring-2 ring-caribbean-teal ring-offset-1' : undefined}
        leftVisual={
          <CategoryHero
            category={heroCategory}
            type={heroType}
            height="h-full min-h-full"
            className="min-h-[inherit] w-full"
            imageUrl={item.image_url}
          />
        }
        sponsored={item.is_sponsored ? <SponsoredBadge size="sm" /> : undefined}
        badges={
          <>
            <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wide">
              {getTypeLabel()}
            </Badge>
            <Badge variant="secondary" className="max-w-[10rem] truncate text-xs">
              <CategoryIcon category={heroCategory} type={heroType} size="sm" className="mr-1 shrink-0" />
              <span className="truncate">{getDisplayCategory()}</span>
            </Badge>
          </>
        }
        title={getDisplayTitle()}
        snippet={listSnippet}
        meta={meta}
        trailing={
          <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end">
            <div onClick={(e) => e.stopPropagation()}>
              <BookmarkButton
                itemType={
                  item.type === 'local-service'
                    ? 'local_service'
                    : item.type === 'past-event'
                      ? 'event'
                      : (item.type as BookmarkItemType)
                }
                itemId={item.id}
                size="sm"
                variant="ghost"
              />
            </div>
            {priceLabel ? (
              <span className="text-sm font-semibold text-primary whitespace-nowrap">{priceLabel}</span>
            ) : null}
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
      id={`item-${item.id}`}
      className={cardClassName}
      onClick={handleViewDetails}
    >
      {/* Item Image Placeholder */}
      <div className={`h-24 bg-gradient-to-br ${getTypeColor()} flex items-center justify-center`}>
        <div className="text-white text-center">
          {getTypeIcon()}
          <div className="text-xs font-medium">
            {(item.type === 'event' || item.type === 'past-event') && item.date
              ? formatDate(item.date)
              : getTypeLabel()}
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-1 pt-2 px-3">
        <div className="flex items-start justify-between mb-1 gap-1">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs whitespace-nowrap flex-shrink-0">
            <span className="truncate max-w-[70px]">{getDisplayCategory()}</span>
          </Badge>
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            <div onClick={(e) => e.stopPropagation()}>
              <BookmarkButton 
                itemType={
                  item.type === 'local-service'
                    ? 'local_service'
                    : item.type === 'past-event'
                      ? 'event'
                      : (item.type as BookmarkItemType)
                }
                itemId={item.id}
                size="sm"
                variant="ghost"
              />
            </div>
            {item.price !== undefined && item.price > 0 && (
              <div className="text-xs sm:text-sm font-bold text-caribbean-teal whitespace-nowrap">
                ${item.price}
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-sm text-gray-900 hover:text-caribbean-teal line-clamp-2 break-words leading-tight">
          {getDisplayTitle()}
        </CardTitle>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">{reviewCount}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-1 px-3 pb-3">
        <CardDescription className="mb-2 line-clamp-2 text-gray-600 break-words text-xs leading-tight">
          {richTextPlainText(getDisplayDescription())}
        </CardDescription>
        <div className="space-y-1 text-xs">
          {item.date && (
            <div className="flex items-center text-gray-600 min-w-0">
              <Calendar className="h-3 w-3 mr-1 text-caribbean-teal/70 flex-shrink-0" />
              <span className="truncate text-xs">
                {formatDate(item.date)}{' '}
                {formatTimeRange(item.start_time, item.end_time)}
              </span>
            </div>
          )}
          {getDisplayLocation() && (
            <div className="flex items-center text-gray-600 min-w-0">
              <MapPin className="h-3 w-3 mr-1 text-caribbean-teal/70 flex-shrink-0" />
              <span className="truncate min-w-0 text-xs">{getDisplayLocation()}</span>
            </div>
          )}
          <div className="flex items-center text-primary min-w-0">
            <MessageCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate min-w-0 text-xs">Open to comment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};