
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
      {/* Navigation */}
      <Navigation />

      {/* Search Section */}
      <div className="bg-yelp-red py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Find Local Events in Boston
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Discover amazing events happening in your neighborhood
          </p>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search events, venues, or activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white border-0 yelp-shadow"
              />
            </div>
            <Button className="h-12 px-8 bg-yelp-orange hover:bg-yelp-yellow text-white font-semibold">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white border-b border-gray-200 yelp-shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-yelp-gray" />
                <span className="text-sm font-medium text-yelp-gray">Filters:</span>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-yelp-gray">
                {filteredEvents.length} events found
              </div>
            </div>

            {/* View Toggle */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as any)}
              className="bg-gray-100 p-1 rounded-lg"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view" className="data-[state=on]:bg-white data-[state=on]:yelp-shadow">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-white data-[state=on]:yelp-shadow">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Map view" className="data-[state=on]:bg-white data-[state=on]:yelp-shadow">
                <MapPin className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="calendar" aria-label="Calendar view" className="data-[state=on]:bg-white data-[state=on]:yelp-shadow">
                <CalendarIcon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yelp-red mx-auto mb-4"></div>
              <p className="text-yelp-gray">Loading amazing events...</p>
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
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
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
            <Search className="h-16 w-16 mx-auto mb-4 text-yelp-light-gray" />
            <h3 className="text-xl font-semibold text-yelp-gray mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all events.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
