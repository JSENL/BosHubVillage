
import { useState, useMemo, useCallback, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, Users, Search, Filter, Grid, List, Map, User, Send, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { useEventHighlight } from "@/hooks/useEventHighlight";
import { createSampleEvents } from "@/utils/sampleEvents";
import { toast } from 'sonner';
import EventsMap from "@/components/EventsMap";

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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [isFree, setIsFree] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  const { events, loading: isLoading, fetchEvents } = useEvents();
  const { highlightedEventId, highlightEvent } = useEventHighlight();

  const categories = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'art', label: 'Arts & Culture' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'family', label: 'Family' },
    { value: 'health', label: 'Health & Wellness' },
  ];

  // Load sample events if no events exist
  useEffect(() => {
    const loadSampleData = async () => {
      if (!isLoading && events.length === 0) {
        try {
          await createSampleEvents();
          fetchEvents();
          toast.success('Sample events loaded!');
        } catch (error) {
          console.error('Error loading sample events:', error);
        }
      }
    };

    loadSampleData();
  }, [events, isLoading, fetchEvents]);

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter(event => {
      const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = categoryFilter && categoryFilter !== 'all' ? event.category === categoryFilter : true;
      const priceMatch = isFree ? event.price === 0 : (event.price >= priceRange[0] && event.price <= priceRange[1]);

      return searchMatch && categoryMatch && priceMatch;
    });
  }, [events, searchQuery, categoryFilter, priceRange, isFree]);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
  }, []);

  const handlePriceRangeChange = useCallback((value: number[]) => {
    setPriceRange(value);
  }, []);

  const handleIsFreeChange = useCallback((checked: boolean) => {
    setIsFree(checked);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list' | 'map') => {
    setViewMode(mode);
  }, []);

  const handleEventSelect = useCallback((eventId: string) => {
    highlightEvent(eventId);
  }, [highlightEvent]);

  return (
    <div className="min-h-screen bg-yelp-light-gray">
      {/* Yelp-style Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 yelp-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-yelp-red">
                EventDiscover
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-yelp-red font-medium">Events</a>
                <a href="#" className="text-gray-700 hover:text-yelp-red font-medium">Categories</a>
                <a href="#" className="text-gray-700 hover:text-yelp-red font-medium">Near Me</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/submit-event'}
                className="bg-yelp-red hover:bg-yelp-red-dark text-white border-0"
              >
                <Send className="h-4 w-4 mr-2" />
                Add Event
              </Button>
              <Button
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                className="border-yelp-red text-yelp-red hover:bg-yelp-red hover:text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Log In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Find Great Events Near You
            </h2>
            <p className="text-xl text-gray-600">
              Discover amazing experiences in your neighborhood
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg yelp-shadow-lg border border-gray-200">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="concerts, food festivals, art shows..."
                  className="pl-10 border-gray-300 focus:border-yelp-red focus:ring-yelp-red"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="md:w-64">
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger className="border-gray-300 focus:border-yelp-red focus:ring-yelp-red">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-yelp-red hover:bg-yelp-red-dark text-white border-0 px-8">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-80">
              <Card className="bg-white border-gray-200 yelp-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <Filter className="h-5 w-5 mr-2 text-yelp-red" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      max={1000}
                      step={10}
                      onValueChange={handlePriceRangeChange}
                      className="[&>.relative]:bg-gray-200 [&_[role=slider]]:bg-yelp-red [&_[role=slider]]:border-yelp-red"
                    />
                    <div className="mt-3 flex items-center space-x-2">
                      <Switch 
                        id="isFree" 
                        checked={isFree} 
                        onCheckedChange={handleIsFreeChange}
                        className="data-[state=checked]:bg-yelp-red"
                      />
                      <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                        Free Events Only
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredEvents.length} Events Found
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Best events near you
                  </p>
                </div>
                
                {/* View Toggle */}
                <div className="flex bg-white border border-gray-300 rounded-lg p-1 mt-4 sm:mt-0">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange('grid')}
                    className={viewMode === 'grid' ? 'bg-yelp-red hover:bg-yelp-red-dark text-white' : 'text-gray-600 hover:text-yelp-red'}
                  >
                    <Grid className="h-4 w-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange('list')}
                    className={viewMode === 'list' ? 'bg-yelp-red hover:bg-yelp-red-dark text-white' : 'text-gray-600 hover:text-yelp-red'}
                  >
                    <List className="h-4 w-4 mr-1" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewModeChange('map')}
                    className={viewMode === 'map' ? 'bg-yelp-red hover:bg-yelp-red-dark text-white' : 'text-gray-600 hover:text-yelp-red'}
                  >
                    <Map className="h-4 w-4 mr-1" />
                    Map
                  </Button>
                </div>
              </div>

              {/* Event Display */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-white border-gray-200">
                      <CardContent className="p-6">
                        <Skeleton className="h-40 w-full rounded-md mb-4" />
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : viewMode === 'map' ? (
                <EventsMap
                  searchQuery={searchQuery}
                  selectedCategory={categoryFilter || 'all'}
                  events={filteredEvents}
                  onEventSelect={handleEventSelect}
                />
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200 yelp-shadow">
                  <div className="text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p>Try adjusting your search criteria or browse all events.</p>
                  </div>
                </div>
              ) : (
                <div className={`space-y-6 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0' : ''}`}>
                  {filteredEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      viewMode={viewMode}
                      isHighlighted={highlightedEventId === event.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
