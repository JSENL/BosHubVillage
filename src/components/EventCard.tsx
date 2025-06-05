
import React from 'react';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  max_attendees?: number;
}

interface EventCardProps {
  event: Event;
  viewMode: 'grid' | 'list' | 'map';
}

export const EventCard: React.FC<EventCardProps> = ({ event, viewMode }) => {
  const handleViewDetails = () => {
    window.location.href = `/event/${event.id}`;
  };

  if (viewMode === 'list') {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant="secondary">{event.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                </div>
                {event.max_attendees && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Max {event.max_attendees}</span>
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleViewDetails} className="ml-4">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge variant="secondary">{event.category}</Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              {event.price === 0 ? 'Free' : `$${event.price}`}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-3">{event.description}</CardDescription>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>Max {event.max_attendees} attendees</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
