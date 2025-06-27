
import React from 'react';
import { Calendar, MapPin, DollarSign, Users, Star, Building, Newspaper, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UnifiedItem } from '@/types/unifiedItem';

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
  const handleViewDetails = () => {
    const routePath = item.type === 'local-service' ? 'local-service' : item.type;
    window.location.href = `/${routePath}/${item.id}`;
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
      'local-service': 'from-yellow-500 to-yellow-600'
    };
    return colors[item.type] || 'from-gray-500 to-gray-600';
  };

  const getTypeLabel = () => {
    const labels = {
      event: 'Event',
      news: 'News',
      business: 'Business',
      'local-service': 'Local Service'
    };
    return labels[item.type] || 'Item';
  };

  const cardClassName = `
    bg-white border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer
    ${isHighlighted ? 'ring-2 ring-purple-500 ring-opacity-75' : ''}
  `;

  // Generate random rating for consistent appearance
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 200) + 25;

  const displayLocation = item.location || item.address || '';
  const displayDescription = item.description || item.content || '';
  const displayCategory = item.category || item.business_type || '';

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
                    ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : getTypeLabel()
                  }
                </div>
              </div>
            </div>
            
            {/* Item Details */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{reviewCount} reviews</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 mb-2">
                    {displayCategory}
                  </Badge>
                  {item.price !== undefined && (
                    <div className="text-lg font-bold text-purple-600">
                      {item.price === 0 ? 'Free' : `$${item.price}`}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{displayDescription}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                {item.date && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                    <span>{item.date} {formatTimeRange(item.start_time, item.end_time)}</span>
                  </div>
                )}
                {displayLocation && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                    <span className="truncate">{displayLocation}</span>
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
              ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : getTypeLabel()
            }
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {displayCategory}
          </Badge>
          {item.price !== undefined && (
            <div className="text-lg font-bold text-purple-600">
              {item.price === 0 ? 'Free' : `$${item.price}`}
            </div>
          )}
        </div>
        <CardTitle className="text-lg text-gray-900 hover:text-purple-600 line-clamp-2">
          {item.title}
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
        <CardDescription className="mb-4 line-clamp-3 text-gray-600">
          {displayDescription}
        </CardDescription>
        <div className="space-y-2 text-sm">
          {item.date && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              <span>{item.date} {formatTimeRange(item.start_time, item.end_time)}</span>
            </div>
          )}
          {displayLocation && (
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-purple-500" />
              <span className="truncate">{displayLocation}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
