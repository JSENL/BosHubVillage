
import { useState, useMemo, useCallback } from 'react';
import { MapPin, Calendar, DollarSign, Users, Search, Filter, Grid, List, Map, User, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/EventCard";
import { useQuery } from "@tanstack/react-query";

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

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: async (): Promise<Event[]> => {
      const res = await fetch('/api/events');
      if (!res.ok) {
        throw new Error('Failed to fetch events');
      }
      return res.json();
    },
  });

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter(event => {
      const searchMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = categoryFilter ? event.category === categoryFilter : true;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Event Discovery
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/submit-event'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Event
              </Button>
              <Button
                onClick={() => window.location.href = '/auth'}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Find Events</CardTitle>
                  <CardDescription>Search for events by title</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search events..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Filters</CardTitle>
                  <CardDescription>Filter events by category and price</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <div className="text-sm font-medium text-gray-700">Category</div>
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <div className="text-sm font-medium text-gray-700">Price Range</div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={priceRange}
                      max={1000}
                      step={10}
                      onValueChange={handlePriceRangeChange}
                    />
                    <div className="mt-2 flex items-center space-x-2">
                      <Switch id="isFree" checked={isFree} onCheckedChange={handleIsFreeChange} />
                      <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                        Free Only
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* View Mode */}
          <div className="flex justify-end space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>

          {/* Event Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-40 w-full rounded-md mb-4" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-red-500">
              Failed to load events. Please try again later.
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center text-gray-500">
              No events found matching your criteria.
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${viewMode === 'list' ? 'list-view' : ''}`}>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
