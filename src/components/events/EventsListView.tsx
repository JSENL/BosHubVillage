import { EventCard } from '@/components/EventCard';
import { Event } from '@/hooks/useEvents';

interface EventsListViewProps {
  events: Event[];
  loading: boolean;
}

export const EventsListView = ({ events, loading }: EventsListViewProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-sm sm:text-base">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or check back later for new events.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="w-full">
          <EventCard
            event={event}
            viewMode="list"
          />
        </div>
      ))}
    </div>
  );
};