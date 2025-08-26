
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, DollarSign, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';


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
}

interface EventCardProps {
  event: Event;
  viewMode: 'grid' | 'list' | 'map';
  isHighlighted?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, viewMode, isHighlighted = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  
  const handleViewDetails = () => {
    navigate(`/event/${event.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
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
    bg-white border-gray-200 yelp-shadow hover:yelp-shadow-lg transition-all duration-300 cursor-pointer
    ${isHighlighted ? 'ring-2 ring-yelp-red ring-opacity-75' : ''}
  `;

  // Generate random rating for Yelp-like appearance
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 500) + 50;

  // Use original content directly (no translations)
  const translatedTitle = event.title;
  const translatedDescription = event.description;
  const translatedLocation = event.location;
  const translatedCategory = event.category;

  if (viewMode === 'list') {
    return (
      <Card 
        id={`event-${event.id}`}
        className={cardClassName}
        onClick={handleViewDetails}
      >
        <CardContent className="p-0">
          <div className="flex">
            
            {/* Event Details */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="text-xl font-bold text-gray-900 hover:text-yelp-red mb-1 line-clamp-2 break-words">
                    {translatedTitle}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < rating ? 'text-yelp-orange fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2 truncate">{reviewCount} reviews</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge variant="secondary" className="bg-yelp-light-gray text-yelp-gray mb-2">
                    <span className="truncate max-w-20">{translatedCategory}</span>
                  </Badge>
                  <div className="text-lg font-bold text-yelp-red">
                    {event.price === 0 ? t('cards.free') : `$${event.price}`}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2 break-words">{translatedDescription}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center min-w-0">
                  <Calendar className="h-4 w-4 mr-2 text-yelp-red flex-shrink-0" />
                  <span className="truncate">{formatDate(event.date)} {formatTimeRange(event.start_time, event.end_time)}</span>
                </div>
                <div className="flex items-center min-w-0">
                  <MapPin className="h-4 w-4 mr-2 text-yelp-red flex-shrink-0" />
                  <span className="truncate break-all min-w-0">{translatedLocation}</span>
                </div>
                {event.max_attendees && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-yelp-red" />
                    <span>Up to {event.max_attendees} people</span>
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
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-1">
          <Badge variant="secondary" className="bg-yelp-light-gray text-yelp-gray text-xs">
            {translatedCategory}
          </Badge>
          <div className="text-sm font-bold text-yelp-red">
            {event.price === 0 ? t('cards.free') : `$${event.price}`}
          </div>
        </div>
        <CardTitle className="text-sm text-gray-900 hover:text-yelp-red line-clamp-2 break-words">
          {translatedTitle}
        </CardTitle>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < rating ? 'text-yelp-orange fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">{reviewCount}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <CardDescription className="mb-2 line-clamp-2 text-gray-600 text-xs break-words">
          {translatedDescription}
        </CardDescription>
        <div className="space-y-1 text-xs">
          <div className="flex items-center text-gray-600 min-w-0">
            <Calendar className="h-3 w-3 mr-2 text-yelp-red flex-shrink-0" />
            <span className="truncate">{formatDate(event.date)} {formatTimeRange(event.start_time, event.end_time)}</span>
          </div>
          <div className="flex items-center text-gray-600 min-w-0">
            <MapPin className="h-3 w-3 mr-2 text-yelp-red flex-shrink-0" />
            <span className="truncate break-all min-w-0">{translatedLocation}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center text-gray-600">
              <Users className="h-3 w-3 mr-2 text-yelp-red" />
              <span>Up to {event.max_attendees} attendees</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
