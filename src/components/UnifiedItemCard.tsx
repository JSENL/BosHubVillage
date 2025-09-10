
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, DollarSign, Users, Star, Building, Newspaper, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnifiedItem } from '@/types/unifiedItem';
import { useContentTranslation } from '@/hooks/useTranslation';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import { BookmarkButton } from '@/components/social/BookmarkButton';
import { useNavigate } from 'react-router-dom';

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
  const { t } = useTranslation();
  const { getTranslatedField, currentLanguage } = useContentTranslation();
  const navigate = useNavigate();
  
  // Auto-translate missing fields based on item type
  const getFieldsForType = (type: string) => {
    switch (type) {
      case 'event': return ['title', 'description', 'location', 'category'];
      case 'business': return ['title', 'description', 'address'];
      case 'local-service': return ['name', 'description', 'address'];
      case 'news': return ['title', 'content', 'location'];
      default: return [];
    }
  };
  
  const tableMap = {
    'event': 'events' as const,
    'business': 'business' as const,
    'local-service': 'local_resources' as const,
    'news': 'news' as const
  };
  
  const table = tableMap[item.type];
  
  // Always call the hook, but only process if we have a valid table
  useAutoTranslate({ 
    item: table ? item : null, 
    table: table || 'events', 
    fields: table ? getFieldsForType(item.type) : [] 
  });
  const handleViewDetails = () => {
    const routePath = item.type === 'local-service' ? 'local-resource' : 
                     item.type === 'business' ? 'business' : item.type;
    navigate(`/${routePath}/${item.id}`);
  };

  const formatTimeRange = (startTime?: string, endTime?: string) => {
    if (!startTime && !endTime) return '';
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    return startTime || endTime || '';
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'event':
        return <Calendar className="h-12 w-12 mx-auto mb-2" />;
      case 'news':
        return <Newspaper className="h-12 w-12 mx-auto mb-2" />;
      case 'business':
        return <Building className="h-12 w-12 mx-auto mb-2" />;
      case 'local-service':
        return <Wrench className="h-12 w-12 mx-auto mb-2" />;
      default:
        return <Calendar className="h-12 w-12 mx-auto mb-2" />;
    }
  };

  const getTypeColor = () => {
    const colors = {
      event: 'from-red-500 to-red-600',
      news: 'from-blue-500 to-blue-600',
      business: 'from-green-500 to-green-600',
      'local-service': 'from-coral-orange to-coral-orange/90'
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
    return labels[item.type] || t('common.view');
  };

  const cardClassName = `
    bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer
    ${isHighlighted ? 'ring-2 ring-caribbean-teal ring-opacity-75' : ''}
  `;

  // Generate random rating for consistent appearance
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 200) + 25;

  // Get translated fields based on item type
  const getTranslatedFields = () => {
    const tableMap = {
      'event': 'events' as const,
      'business': 'business' as const,
      'local-service': 'local_resources' as const,
      'news': 'news' as const
    };
    
    const table = tableMap[item.type];
    
    if (!table) {
      return {
        title: item.title,
        description: item.description || item.content || '',
        location: item.location || item.address || '',
        category: item.category || item.business_type || ''
      };
    }
    
    return {
      title: getTranslatedField(item, 'title', table) || getTranslatedField(item, 'name', table) || item.title,
      description: getTranslatedField(item, 'description', table) || getTranslatedField(item, 'content', table) || item.description || item.content || '',
      location: getTranslatedField(item, 'location', table) || getTranslatedField(item, 'address', table) || item.location || item.address || '',
      category: getTranslatedField(item, 'category', table) || item.category || item.business_type || ''
    };
  };
  
  const translatedFields = getTranslatedFields();

  if (viewMode === 'list') {
    return (
      <Card 
        id={`item-${item.id}`}
        className={cardClassName}
        onClick={handleViewDetails}
      >
        <CardContent className="p-0">
          <div className="flex">
            {/* Item Image Placeholder */}
            <div className={`w-60 h-48 bg-gradient-to-br ${getTypeColor()} flex items-center justify-center flex-shrink-0`}>
              <div className="text-white text-center">
                {getTypeIcon()}
                <div className="text-sm font-medium">
                  {item.type === 'event' && item.date 
                    ? new Date(item.date).toLocaleDateString(currentLanguage === 'en' ? 'en-US' : currentLanguage, { month: 'short', day: 'numeric' })
                    : getTypeLabel()
                  }
                </div>
              </div>
            </div>
            
            {/* Item Details */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="text-xl font-bold text-gray-900 hover:text-caribbean-teal mb-1 line-clamp-2 break-words">
                    {translatedFields.title}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2 truncate">{reviewCount} reviews</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <BookmarkButton 
                      itemType={item.type === 'local-service' ? 'local_service' : item.type as any}
                      itemId={item.id}
                      size="sm"
                      variant="ghost"
                    />
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      <span className="truncate max-w-24">{translatedFields.category}</span>
                    </Badge>
                  </div>
                  {item.price !== undefined && (
                    <div className="text-lg font-bold text-caribbean-teal">
                      {item.price === 0 ? t('cards.free') : `$${item.price}`}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2 break-words">{translatedFields.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                {item.date && (
                  <div className="flex items-center min-w-0">
                    <Calendar className="h-4 w-4 mr-2 text-caribbean-teal/70 flex-shrink-0" />
                    <span className="truncate">{item.date} {formatTimeRange(item.start_time, item.end_time)}</span>
                  </div>
                )}
                {translatedFields.location && (
                  <div className="flex items-center min-w-0">
                    <MapPin className="h-4 w-4 mr-2 text-caribbean-teal/70 flex-shrink-0" />
                    <span className="truncate break-all min-w-0">{translatedFields.location}</span>
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
      <div className={`h-48 bg-gradient-to-br ${getTypeColor()} flex items-center justify-center`}>
        <div className="text-white text-center">
          {getTypeIcon()}
          <div className="text-sm font-medium">
            {item.type === 'event' && item.date 
              ? new Date(item.date).toLocaleDateString(currentLanguage === 'en' ? 'en-US' : currentLanguage, { month: 'short', day: 'numeric' })
              : getTypeLabel()
            }
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {translatedFields.category}
          </Badge>
          <div className="flex items-center gap-2">
            <BookmarkButton 
              itemType={item.type === 'local-service' ? 'local_service' : item.type as any}
              itemId={item.id}
              size="sm"
              variant="ghost"
            />
            {item.price !== undefined && (
              <div className="text-lg font-bold text-caribbean-teal">
                {item.price === 0 ? t('cards.free') : `$${item.price}`}
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-lg text-gray-900 hover:text-caribbean-teal line-clamp-2 break-words">
          {translatedFields.title}
        </CardTitle>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">{reviewCount}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="mb-4 line-clamp-3 text-gray-600 break-words">
          {translatedFields.description}
        </CardDescription>
        <div className="space-y-2 text-sm">
          {item.date && (
            <div className="flex items-center text-gray-600 min-w-0">
              <Calendar className="h-4 w-4 mr-2 text-caribbean-teal/70 flex-shrink-0" />
              <span className="truncate">{item.date} {formatTimeRange(item.start_time, item.end_time)}</span>
            </div>
          )}
          {translatedFields.location && (
            <div className="flex items-center text-gray-600 min-w-0">
              <MapPin className="h-4 w-4 mr-2 text-caribbean-teal/70 flex-shrink-0" />
              <span className="truncate break-all min-w-0">{translatedFields.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
