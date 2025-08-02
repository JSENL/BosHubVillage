
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Event } from '@/hooks/useEvents';
import EventComments from './EventComments';

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailsModal = ({ event, isOpen, onClose }: EventDetailsModalProps) => {
  if (!event) return null;

  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime && !endTime) return 'Time TBD';
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    return startTime || endTime;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start mb-4">
            <Badge variant="secondary" className="bg-caribbean-teal/10 text-caribbean-teal">
              {event.category}
            </Badge>
            <div className="flex items-center text-lg font-bold text-caribbean-teal">
              <DollarSign className="h-5 w-5 mr-1" />
              {event.price}
            </div>
          </div>
          <DialogTitle className="text-2xl mb-4">{event.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div>
            <p className="text-gray-700 mb-4">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-caribbean-teal/70" />
                <div>
                  <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                  <div className="text-gray-600">{formatTimeRange(event.start_time, event.end_time)}</div>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-caribbean-teal/70" />
                <div className="font-medium">{event.location}</div>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-caribbean-teal/70" />
                <div>
                  <span className="font-medium">{event.attendees_count || 0}</span>
                  <span className="text-gray-600"> attending</span>
                  {event.max_attendees && (
                    <span className="text-gray-600"> / {event.max_attendees} max</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pb-4 border-b">
            <Button className="bg-gradient-to-r from-caribbean-teal to-grass-green hover:from-caribbean-teal/90 hover:to-grass-green/90 text-white">
              Register for Event
            </Button>
            <Button variant="outline" className="border-caribbean-teal text-caribbean-teal hover:bg-caribbean-teal/10">
              Share Event
            </Button>
          </div>

          {/* Comments Section */}
          <EventComments eventId={event.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
