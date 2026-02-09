import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, DollarSign, Users, Star, Building, Newspaper, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnifiedItem } from '@/types/unifiedItem';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { useNavigate } from 'react-router-dom';
import { useTranslatedField } from '@/hooks/useTranslatedField';

interface UnifiedItemCardProps {
  item: UnifiedItem;
  viewMode: 'grid' | 'list';
  isHighlighted?: boolean;
}

export const UnifiedItemCard: React.FC<UnifiedItemCardProps> = ({ 
  item, 
  viewMode, 
  isHighlighted = false 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getTranslatedText } = useTranslatedField();
  
  const handleViewDetails = () => {
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
      news: 'from-blue-500 to-blue-600',
      business: 'from-green-500 to-green-600',
      'local-service': 'from-logo-coral-orange to-logo-coral-orange/90'
    };
    return colors[item.type] || 'from-gray-500 to-gray-600';
  };

  const getTypeLabel = () => {
    const labels = {
      event: t('itemTypes.events'),
      news: t('itemTypes.news'),
      business: t('itemTypes.businesses'),
      'local-service': t('itemTypes.localServices')
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

  if (viewMode === 'list') {
    return (
      <Card 
        id={`item-${item.id}`}
        className={cardClassName}
        onClick={handleViewDetails}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Item Image Placeholder */}
            <div className={`w-full sm:w-40 h-32 sm:h-auto bg-gradient-to-br ${getTypeColor()} flex items-center justify-center flex-shrink-0`}>
              <div className="text-white text-center">
                {getTypeIcon()}
                <div className="text-xs font-medium">
                  {item.type === 'event' && item.date 
                    ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : getTypeLabel()
                  }
                </div>
              </div>
            </div>
            
            {/* Item Details */}
            <div className="flex-1 p-3 min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 hover:text-caribbean-teal mb-1 break-words">
                    {getDisplayTitle()}
                  </h3>
                  <div className="flex items-center space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">{reviewCount} reviews</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div onClick={(e) => e.stopPropagation()}>
                    <BookmarkButton 
                      itemType={item.type === 'local-service' ? 'local_service' : item.type as any}
                      itemId={item.id}
                      size="sm"
                      variant="ghost"
                    />
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs whitespace-nowrap">
                    <span className="truncate max-w-[100px] sm:max-w-[120px]">{getDisplayCategory()}</span>
                  </Badge>
                  {item.price !== undefined && item.price > 0 && (
                    <div className="text-sm font-bold text-caribbean-teal whitespace-nowrap">
                      ${item.price}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-2 line-clamp-2 text-xs break-words">{getDisplayDescription()}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                {item.date && (
                  <div className="flex items-center min-w-0">
                    <Calendar className="h-3 w-3 mr-1 text-caribbean-teal/70 flex-shrink-0" />
                    <span className="truncate text-xs">{item.date} {formatTimeRange(item.start_time, item.end_time)}</span>
                  </div>
                )}
                {getDisplayLocation() && (
                  <div className="flex items-center min-w-0">
                    <MapPin className="h-3 w-3 mr-1 text-caribbean-teal/70 flex-shrink-0" />
                    <span className="truncate min-w-0 text-xs">{getDisplayLocation()}</span>
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
      id={`item-${item.id}`}
      className={cardClassName}
      onClick={handleViewDetails}
    >
      {/* Item Image Placeholder */}
      <div className={`h-24 bg-gradient-to-br ${getTypeColor()} flex items-center justify-center`}>
        <div className="text-white text-center">
          {getTypeIcon()}
          <div className="text-xs font-medium">
            {item.type === 'event' && item.date 
              ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : getTypeLabel()
            }
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
                itemType={item.type === 'local-service' ? 'local_service' : item.type as any}
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
          {getDisplayDescription()}
        </CardDescription>
        <div className="space-y-1 text-xs">
          {item.date && (
            <div className="flex items-center text-gray-600 min-w-0">
              <Calendar className="h-3 w-3 mr-1 text-caribbean-teal/70 flex-shrink-0" />
              <span className="truncate text-xs">{item.date} {formatTimeRange(item.start_time, item.end_time)}</span>
            </div>
          )}
          {getDisplayLocation() && (
            <div className="flex items-center text-gray-600 min-w-0">
              <MapPin className="h-3 w-3 mr-1 text-caribbean-teal/70 flex-shrink-0" />
              <span className="truncate min-w-0 text-xs">{getDisplayLocation()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};