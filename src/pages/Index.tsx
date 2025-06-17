import { useState, useMemo } from 'react';
import { useEvents, Event } from '@/hooks/useEvents';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { EventCard } from '@/components/EventCard';
import EventsMap from '@/components/EventsMap';
import EventsCalendar from '@/components/EventsCalendar';
import { Navigation } from '@/components/Navigation';
import { allSampleEvents } from '@/utils/sampleEvents';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MapPin, 
  Calendar as CalendarIcon,
} from 'lucide-react';

const Index = () => {
  const { events, loading } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map' | 'calendar'>('grid');

  // Transform sample events to match Event interface
  const transformedSampleEvents: Event[] = useMemo(() => {
    return allSampleEvents.map((sampleEvent, index) => ({
      id: `sample-${index}`,
      title: sampleEvent.title,
      description: sampleEvent.description,
      category: sampleEvent.category,
      date: sampleEvent.date,
      time: sampleEvent.time,
      location: sampleEvent.location,
      price: sampleEvent.price,
      max_attendees: sampleEvent.max_attendees,
      is_recurring: sampleEvent.is_recurring,
      recurring_pattern: sampleEvent.recurring_pattern,
      created_by: 'sample-user',
      latitude: sampleEvent.latitude,
      longitude: sampleEvent.longitude,
      attendees_count: 0
    }));
  }, []);

  // Combine API events with transformed sample events
  const allEvents = useMemo(() => {
    return [...events, ...transformedSampleEvents];
  }, [events, transformedSampleEvents]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'art', label: 'Arts & Culture' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'family', label: 'Family' },
    { value: 'health', label: 'Health & Wellness' },
  ];

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'free' && event.price === 0) ||
                        (priceRange === 'paid' && event.price > 0);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-yelp-light-gray">
      {/* Navigation with Search */}
      <Navigation 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Hero Section */}
      <div className="bg-yelp-red">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
              Find Local Events in Boston
            </h2>
            <p className="text-lg sm:text-xl text-white/90">
              Discover amazing events happening in your neighborhood
            </p>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white border-b border-gray-200 yelp-shadow-lg sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-yelp-gray" />
                <span className="text-xs sm:text-sm font-medium text-yelp-gray">Filters:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-36 sm:w-48 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-24 sm:w-32 h-8 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-xs sm:text-sm text-yelp-gray">
                {filteredEvents.length} events found
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center sm:justify-end">
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value as any)}
                className="bg-gray-100 p-1 rounded-lg"
              >
                <ToggleGroupItem 
                  value="grid" 
                  aria-label="Grid view" 
                  className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="list" 
                  aria-label="List view" 
                  className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="map" 
                  aria-label="Map view" 
                  className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
                >
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="calendar" 
                  aria-label="Calendar view" 
                  className="data-[state=on]:bg-white data-[state=on]:yelp-shadow h-8 w-8 sm:h-10 sm:w-10"
                >
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-yelp-red mx-auto mb-4"></div>
              <p className="text-yelp-gray text-sm sm:text-base">Loading amazing events...</p>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <EventsMap 
            events={filteredEvents} 
            searchQuery={searchTerm}
            selectedCategory={selectedCategory}
          />
        ) : viewMode === 'calendar' ? (
          <EventsCalendar 
            events={filteredEvents}
            searchQuery={searchTerm}
            selectedCategory={selectedCategory}
          />
        ) : (
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
        )}

        {filteredEvents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-yelp-light-gray" />
            <h3 className="text-lg sm:text-xl font-semibold text-yelp-gray mb-2">No events found</h3>
            <p className="text-gray-600 text-sm sm:text-base">Try adjusting your search criteria or browse all events.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
