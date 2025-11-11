import { EventCard } from '@/components/EventCard';
import { Event } from '@/hooks/useEvents';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/common/PaginationControls';

interface EventsGridViewProps {
  events: Event[];
  loading: boolean;
}

export const EventsGridView = ({ events, loading }: EventsGridViewProps) => {
  const {
    currentItems: currentEvents,
    currentPage,
    totalPages,
    totalItems,
    setCurrentPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination({ items: events, itemsPerPage: 12 });

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
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {currentEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            viewMode="grid"
          />
        ))}
      </div>
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        totalItems={totalItems}
      />
    </div>
  );
};