import { EventsGridView } from '@/components/events/EventsGridView';
import { EventsListView } from '@/components/events/EventsListView';
import { EnhancedUniversalMap } from '@/components/EnhancedUniversalMap';
import EventsCalendar from '@/components/EventsCalendar';
import { Event } from '@/hooks/useEvents';
import { UnifiedItem } from '@/types/unifiedItem';

interface EventsContentProps {
  viewMode: 'grid' | 'list' | 'map' | 'calendar';
  filteredEvents: Event[];
  searchTerm: string;
  selectedCategory: string;
  loading: boolean;
  selectedTypes?: string[];
  onTypeToggle?: (type: string) => void;
}

export const EventsContent = ({
  viewMode,
  filteredEvents,
  searchTerm,
  selectedCategory,
  loading,
  selectedTypes = ['event'],
  onTypeToggle
}: EventsContentProps) => {
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

  if (viewMode === 'map') {
    // Convert events to unified items for the enhanced map
    const unifiedItems: UnifiedItem[] = filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      latitude: event.latitude,
      longitude: event.longitude,
      type: 'event' as const,
      location: event.location,
      category: event.category,
      date: event.date,
      start_time: event.start_time,
      end_time: event.end_time,
      price: event.price,
      neighborhoods: event.neighborhoods,
      originalData: event
    }));

    return (
      <EnhancedUniversalMap 
        items={unifiedItems}
        height="600px"
        selectedTypes={selectedTypes}
      />
    );
  }

  if (viewMode === 'calendar') {
    return <EventsCalendar searchQuery={searchTerm} selectedCategory={selectedCategory} events={filteredEvents} />;
  }

  if (viewMode === 'grid') {
    return <EventsGridView events={filteredEvents} loading={loading} />;
  }

  if (viewMode === 'list') {
    return <EventsListView events={filteredEvents} loading={loading} />;
  }

  // Default to grid view
  return <EventsGridView events={filteredEvents} loading={loading} />;
};