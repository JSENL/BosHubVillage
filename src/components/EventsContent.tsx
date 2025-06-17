
import { EventCard } from '@/components/EventCard';
import EventsMap from '@/components/EventsMap';
import EventsCalendar from '@/components/EventsCalendar';
import { Event } from '@/hooks/useEvents';
import { Search } from 'lucide-react';

interface EventsContentProps {
  viewMode: 'grid' | 'list' | 'map' | 'calendar';
  filteredEvents: Event[];
  searchTerm: string;
  selectedCategory: string;
  loading: boolean;
}

export const EventsContent = ({
  viewMode,
  filteredEvents,
  searchTerm,
  selectedCategory,
  loading
}: EventsContentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-yelp-red mx-auto mb-4"></div>
          <p className="text-yelp-gray text-sm sm:text-base">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'map') {
    return (
      <EventsMap 
        events={filteredEvents} 
        searchQuery={searchTerm}
        selectedCategory={selectedCategory}
      />
    );
  }

  if (viewMode === 'calendar') {
    return (
      <EventsCalendar 
        events={filteredEvents}
        searchQuery={searchTerm}
        selectedCategory={selectedCategory}
      />
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-yelp-light-gray" />
        <h3 className="text-lg sm:text-xl font-semibold text-yelp-gray mb-2">No events found</h3>
        <p className="text-gray-600 text-sm sm:text-base">Try adjusting your search criteria or browse all events.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {filteredEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          viewMode={viewMode as 'grid' | 'list'}
        />
      ))}
    </div>
  );
};
