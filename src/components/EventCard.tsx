
import React from 'react';
import { Calendar, MapPin, DollarSign, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const handleViewDetails = () => {
    window.location.href = `/event/${event.id}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime && !endTime) return '';
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    return startTime || endTime;
  };

  const cardClassName = `
    bg-white border-gray-200 yelp-shadow hover:yelp-shadow-lg transition-all duration-300 cursor-pointer
    ${isHighlighted ? 'ring-2 ring-yelp-red ring-opacity-75' : ''}
  `;

  // Generate random rating for Yelp-like appearance
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 500) + 50;

  if (viewMode === 'list') {
    return (
      <Card 
        id={`event-${event.id}`}
        className={cardClassName}
        onClick={handleViewDetails}
      >
        <CardContent className="p-0">
          <div className="flex">
            {/* Event Image Placeholder */}
            <div className="w-60 h-48 bg-gradient-to-br from-yelp-red to-yelp-orange flex items-center justify-center flex-shrink-0">
              <div className="text-white text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2" />
                <div className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
            
            {/* Event Details */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-yelp-red mb-1">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < rating ? 'text-yelp-orange fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{reviewCount} reviews</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-yelp-light-gray text-yelp-gray mb-2">
                    {event.category}
                  </Badge>
                  <div className="text-lg font-bold text-yelp-red">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-yelp-red" />
                  <span>{event.date} {formatTimeRange(event.start_time, event.end_time)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-yelp-red" />
                  <span className="truncate">{event.location}</span>
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
      className={cardClassName}
      onClick={handleViewDetails}
    >
      {/* Event Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-yelp-red to-yelp-orange flex items-center justify-center">
        <div className="text-white text-center">
          <Calendar className="h-12 w-12 mx-auto mb-2" />
          <div className="text-sm font-medium">
            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="bg-yelp-light-gray text-yelp-gray">
            {event.category}
          </Badge>
          <div className="text-lg font-bold text-yelp-red">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </div>
        </div>
        <CardTitle className="text-lg text-gray-900 hover:text-yelp-red line-clamp-2">
          {event.title}
        </CardTitle>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? 'text-yelp-orange fill-current' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">{reviewCount}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="mb-4 line-clamp-3 text-gray-600">
          {event.description}
        </CardDescription>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-yelp-red" />
            <span>{event.date} {formatTimeRange(event.start_time, event.end_time)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-yelp-red" />
            <span className="truncate">{event.location}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 text-yelp-red" />
              <span>Up to {event.max_attendees} attendees</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
