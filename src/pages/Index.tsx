
import { useState, useMemo } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { EventFilters } from '@/components/EventFilters';
import { ViewToggle } from '@/components/ViewToggle';
import { EventsContent } from '@/components/EventsContent';
import { useEventFiltering } from '@/hooks/useEventFiltering';
import { useSampleEvents } from '@/hooks/useSampleEvents';

const Index = () => {
  const { events, loading } = useEvents();
  const { transformedSampleEvents } = useSampleEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'calendar'>('grid');

  // Combine API events with transformed sample events
  const allEvents = useMemo(() => {
    return [...events, ...transformedSampleEvents];
  }, [events, transformedSampleEvents]);

  const { filteredEvents } = useEventFiltering({
    events: allEvents,
    searchTerm,
    selectedCategory,
    priceRange,
    selectedLocation,
    selectedEventType,
    selectedNeighborhood
  });

  return (
    <div className="min-h-screen bg-yelp-light-gray">
      {/* Navigation with Search */}
      <Navigation 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Hero Section */}
      <HeroSection 
        title="Find Local Events in Boston"
        subtitle="Discover amazing events happening in your neighborhood"
      />

      {/* Filters and View Toggle */}
      <div className="bg-white border-b border-gray-200 yelp-shadow-lg sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <EventFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              selectedEventType={selectedEventType}
              onEventTypeChange={setSelectedEventType}
              selectedNeighborhood={selectedNeighborhood}
              onNeighborhoodChange={setSelectedNeighborhood}
              filteredEventsCount={filteredEvents.length}
            />

            {/* View Toggle */}
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <EventsContent
          viewMode={viewMode}
          filteredEvents={filteredEvents}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default Index;
