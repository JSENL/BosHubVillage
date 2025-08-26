import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-day-picker';
import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { UniversalFilters } from "@/components/UniversalFilters";
import { SectionMap } from "@/components/SectionMap";
import { EventCard } from "@/components/EventCard";
import NewsCard from "@/components/NewsCard";
import BusinessCard from "@/components/BusinessCard";
import LocalServiceCard from "@/components/LocalServiceCard";
import { useEvents } from "@/hooks/useEvents";
import { useNews } from "@/hooks/useNews";

import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeEvents } from "@/utils/geocodeEvents";
import { geocodeNewsItems } from "@/utils/geocodeNewsItems";
import { geocodeBusinesses } from "@/utils/geocodeBusinesses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Map, List, Filter } from 'lucide-react';
import { UnifiedItem } from "@/types/unifiedItem";
import { EnhancedUniversalMap } from "@/components/EnhancedUniversalMap";
import { ListViewFilters } from "@/components/ListViewFilters";
import { TestTranslation } from "@/components/TestTranslation";

const Index = () => {
  const { t } = useTranslation();
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventDateRange, setEventDateRange] = useState<DateRange | undefined>();
  const [selectedEventDates, setSelectedEventDates] = useState<Date[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showTranslationTest, setShowTranslationTest] = useState(false);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [isRefreshingMap, setIsRefreshingMap] = useState(false);

  // Data hooks - using correct property names based on actual hook implementations
  const { events, loading: eventsLoading } = useEvents();
  const { data: news, isLoading: newsLoading } = useNews();
  
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { submissions: businessSubmissions, loading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { data: localServices, isLoading: localServicesLoading } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading } = useLocalServiceSubmissions();

  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedItems, setHasGeocodedItems] = useState(false);

  // Combine all data into unified items (excluding news from map and cards)
  const allItems: UnifiedItem[] = [
    ...(events || []).map(event => ({
      id: event.id,
      title: event.title,
      description: event.description || '',
      latitude: event.latitude,
      longitude: event.longitude,
      type: 'event' as const,
      location: event.location,
      address: event.address || event.location,
      category: event.category,
      date: event.date,
      start_time: event.start_time,
      end_time: event.end_time,
      price: Number(event.price || 0),
      neighborhoods: event.neighborhoods,
      villages: event.villages,
      originalData: event
    })),
    ...(businesses || []).map(business => ({
      id: business.id,
      title: business.title,
      description: business.description || '',
      latitude: business.latitude,
      longitude: business.longitude,
      type: 'business' as const,
      address: business.address,
      category: business.business_type,
      business_type: business.business_type,
      villages: business.villages,
      neighborhoods: business.neighborhood,
      originalData: business
    })),
    ...(businessSubmissions || []).map(businessSubmission => ({
      id: businessSubmission.id,
      title: businessSubmission.title,
      description: businessSubmission.description || '',
      latitude: businessSubmission.latitude,
      longitude: businessSubmission.longitude,
      type: 'business' as const,
      address: businessSubmission.address,
      category: businessSubmission.business_type,
      business_type: businessSubmission.business_type,
      neighborhoods: businessSubmission.neighborhood,
      villages: undefined, // business_submissions table doesn't have villages column
      originalData: businessSubmission
    })),
    ...(localServices || []).map(localService => ({
      id: localService.id,
      title: localService.name,
      description: localService.description || '',
      latitude: localService.latitude,
      longitude: localService.longitude,
      type: 'local-service' as const,
      address: localService.address,
      category: localService.category,
      name: localService.name,
      neighborhoods: localService.neighborhood,
      villages: localService.village,
      originalData: localService
    })),
    ...(localServiceSubmissions || []).map(localServiceSubmission => ({
      id: localServiceSubmission.id,
      title: localServiceSubmission.name,
      description: localServiceSubmission.description || '',
      latitude: localServiceSubmission.latitude,
      longitude: localServiceSubmission.longitude,
      type: 'local-service' as const,
      address: localServiceSubmission.address,
      category: localServiceSubmission.category,
      name: localServiceSubmission.name,
      neighborhoods: localServiceSubmission.neighborhood,
      villages: localServiceSubmission.village,
      originalData: localServiceSubmission
    }))
  ];

  const isLoading = eventsLoading || newsLoading || 
                   businessLoading || businessSubmissionsLoading ||
                   localServicesLoading || localServiceSubmissionsLoading;

  // Filter items based on criteria
  console.log('🔍 Index.tsx filtering - Filter State Analysis:', { 
    selectedType, 
    searchTerm, 
    selectedCategory, 
    selectedNeighborhood, 
    selectedVillage, 
    eventDateRange: eventDateRange ? {
      from: eventDateRange.from?.toDateString(),
      to: eventDateRange.to?.toDateString()
    } : null, 
    selectedEventDatesCount: selectedEventDates.length,
    totalItemsToFilter: allItems.length,
    eventItemsCount: allItems.filter(item => item.type === 'event').length
  });
  
  const filteredItems = allItems.filter(item => {
    // Exclude past events
    if (item.type === 'event' && item.date) {
      const eventDate = new Date(item.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      
      if (eventDate < today) {
        return false; // Exclude past events
      }
    }

    // Type filter
    const matchesType = selectedType === 'all' || item.type === selectedType;

    // Search term filter
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'all' || 
      item.category === selectedCategory ||
      item.business_type === selectedCategory;

    // Neighborhood filter
    const matchesNeighborhood = selectedNeighborhood === 'all' || 
      (item.neighborhoods && item.neighborhoods.includes(selectedNeighborhood.replace('-', ' '))) ||
      (item.location && item.location.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase())) ||
      (item.address && item.address.toLowerCase().includes(selectedNeighborhood.replace('-', ' ').toLowerCase()));

    // Village filter (enhanced for all item types)
    const matchesVillage = selectedVillage === 'all' || (() => {
      // Debug logging for village filtering
      if (selectedVillage !== 'all') {
        console.log(`🏘️ Village filter check for ${item.title}:`, {
          selectedVillage,
          itemType: item.type,
          itemVillages: item.villages,
          hasVillages: !!item.villages
        });
      }
      
      if (!item.villages) return false;
      
      // Handle both single village string and array of villages
      const itemVillages = Array.isArray(item.villages) ? item.villages : [item.villages];
      
      return itemVillages.some(village => {
        const normalized = village.toLowerCase().replace(/\s+/g, '-');
        const selectedNormalized = selectedVillage.toLowerCase();
        const selectedWithSpaces = selectedVillage.replace('-', ' ').toLowerCase();
        
        return normalized === selectedNormalized ||
               village.toLowerCase() === selectedWithSpaces ||
               village.toLowerCase().includes(selectedWithSpaces) ||
               selectedWithSpaces.includes(village.toLowerCase());
      });
    })();

    // Event date filter (only for events)
    const matchesEventDate = item.type !== 'event' || (() => {
      if (!item.date) return false;
      
      const itemDate = new Date(item.date);
      
      // Check if any individual dates are selected
      if (selectedEventDates.length > 0) {
        const matches = selectedEventDates.some(selectedDate => 
          selectedDate.toDateString() === itemDate.toDateString()
        );
        
        console.log('📅 Index: Individual date filtering for event:', {
          eventTitle: item.title,
          itemDate: itemDate.toDateString(),
          selectedEventDates: selectedEventDates.map(d => d.toDateString()),
          matches
        });
        
        return matches;
      }
      
      // Check if date range is selected
      if (eventDateRange?.from) {
        const fromDate = new Date(eventDateRange.from);
        const toDate = eventDateRange.to ? new Date(eventDateRange.to) : fromDate;
        
        // Set to start/end of day for accurate comparison
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        
        const matches = itemDate >= fromDate && itemDate <= toDate;
        
        console.log('📅 Index: Date range filtering for event:', {
          eventTitle: item.title,
          itemDate: itemDate.toDateString(),
          fromDate: fromDate.toDateString(),
          toDate: toDate.toDateString(),
          matches
        });
        
        return matches;
      }
      
      // If no date filters selected, show all events
      return true;
    })();

    return matchesType && matchesSearch && matchesCategory && matchesNeighborhood && matchesVillage && matchesEventDate;
  });

  // Debug logging for filtering results
  if (selectedVillage !== 'all') {
    const villageDebug = {
      selectedVillage,
      totalItems: allItems.length,
      filteredItems: filteredItems.length,
      itemsWithVillages: allItems.filter(item => !!item.villages).length,
      villageBreakdown: allItems.reduce((acc, item) => {
        if (item.villages) {
          acc[item.type] = (acc[item.type] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    };
    console.log('🏘️ Village filtering summary:', villageDebug);
  }

  // Create filtered items for map (including all item types)
  const mapItems = filteredItems;

  console.log('✅ Index.tsx filtering results:', {
    totalItems: allItems.length,
    filteredItems: filteredItems.length,
    eventItems: filteredItems.filter(item => item.type === 'event').length,
    businessItems: filteredItems.filter(item => item.type === 'business').length,
    localServiceItems: filteredItems.filter(item => item.type === 'local-service').length,
    hasDateFilters: selectedEventDates.length > 0 || !!eventDateRange?.from,
    dateFilterType: selectedEventDates.length > 0 ? 'individual' : eventDateRange?.from ? 'range' : 'none'
  });

  // Geocode items that need geocoding
  useEffect(() => {
    const geocodeItemsIfNeeded = async () => {
      if (!isReady || hasGeocodedItems || isLoading) {
        return;
      }

      try {
        // Geocode events
        const eventsNeedingGeocode = (events || []).filter(event => 
          (!event.latitude || !event.longitude) && event.location
        );
        if (eventsNeedingGeocode.length > 0) {
          await geocodeEvents(eventsNeedingGeocode, geocode);
        }

        // Geocode news
        const newsNeedingGeocode = (news || []).filter(newsItem => 
          newsItem.location && 
          newsItem.location.trim() !== '' &&
          (!newsItem.latitude || !newsItem.longitude || 
           newsItem.latitude === null || newsItem.longitude === null)
        );
        if (newsNeedingGeocode.length > 0) {
          await geocodeNewsItems(newsNeedingGeocode, geocode);
        }

        // Geocode businesses
        const businessesNeedingGeocode = (businesses || []).filter(business => 
          business.address && 
          business.address.trim() !== '' &&
          (!business.latitude || !business.longitude || 
           business.latitude === null || business.longitude === null)
        );
        if (businessesNeedingGeocode.length > 0) {
          await geocodeBusinesses(businessesNeedingGeocode, geocode);
        }

        setHasGeocodedItems(true);
      } catch (error) {
        console.error('Error geocoding items:', error);
      }
    };

    geocodeItemsIfNeeded();
  }, [events, news, businesses, isReady, geocode, hasGeocodedItems, isLoading]);

  // Auto-refresh map when switching from list to map view
  useEffect(() => {
    if (viewMode === 'map') {
      console.log('🔄 Switching to map view, initiating auto-refresh...');
      setIsRefreshingMap(true);
      
      // Small delay to ensure DOM cleanup, then refresh map
      const refreshTimeout = setTimeout(() => {
        setMapRefreshKey(prev => prev + 1);
        console.log(`🗺️ Map refresh triggered with key: ${mapRefreshKey + 1}`);
        
        // Reset refresh state after a short delay
        setTimeout(() => {
          setIsRefreshingMap(false);
          console.log('✅ Map refresh completed');
        }, 500);
      }, 100);

      return () => clearTimeout(refreshTimeout);
    }
  }, [viewMode]);

  // Handler for view mode changes with refresh logic
  const handleViewModeChange = (newViewMode: 'map' | 'list') => {
    console.log(`🔄 View mode changing from ${viewMode} to ${newViewMode}`);
    setViewMode(newViewMode);
  };

  const renderItem = (item: UnifiedItem) => {
    switch (item.type) {
      case 'event':
        return <EventCard key={item.id} event={item.originalData} viewMode="grid" />;
      case 'business':
        return <BusinessCard key={item.id} business={item.originalData} />;
      case 'local-service':
        return <LocalServiceCard key={item.id} localService={item.originalData} />;
      default:
        return null;
    }
  };

  // Determine selected types for the map (excluding news)
  const selectedTypesForMap = selectedType === 'all' 
    ? ['event', 'business', 'local-service'] 
    : [selectedType];

  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 w-full">
        <Navigation />
        <HeroSection />
        
        {/* Filters Component */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <ListViewFilters
            allItems={allItems}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodChange={setSelectedNeighborhood}
            selectedVillage={selectedVillage}
            onVillageChange={setSelectedVillage}
            eventDateRange={eventDateRange}
            onEventDateRangeChange={setEventDateRange}
            selectedEventDates={selectedEventDates}
            onSelectedEventDatesChange={setSelectedEventDates}
            filteredItemsCount={filteredItems.length}
            onViewModeChange={handleViewModeChange}
          />
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Local Community</h2>
              <div className="text-sm text-gray-600">
                {filteredItems.length} results found
              </div>
            </div>

            {/* Content list */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading content...</p>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="space-y-6">
                  {filteredItems.map(renderItem)}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No content found. Try adjusting your filters!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Local Community</h2>
          
          {/* Mobile-responsive map */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Tab system for Map/List view */}
            <div className="flex border-b bg-gray-50">
              <button
                onClick={() => handleViewModeChange('map')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-white text-caribbean-teal border-b-2 border-caribbean-teal"
              >
                <Map className="h-4 w-4" />
                Map View {isRefreshingMap && <span className="text-xs">(Refreshing...)</span>}
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <List className="h-4 w-4" />
                List View
              </button>
            </div>
            
            {/* Map view content */}
            <div className="h-[250px] md:h-[600px] w-full relative">
              {isRefreshingMap && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-10">
                  <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-caribbean-teal"></div>
                    <span className="text-sm text-gray-600">Refreshing map...</span>
                  </div>
                </div>
              )}
              <EnhancedUniversalMap 
                key={`main-map-${mapRefreshKey}`} // Dynamic key for forced refresh
                items={mapItems}
                height="100%"
                selectedTypes={selectedTypesForMap}
                viewMode={viewMode}
              />
            </div>
          </div>

          {/* Search all content - positioned below map and above filters */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search all content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Mobile-optimized filters */}
          <div className="bg-white rounded-lg border shadow-sm">
            <UniversalFilters
              allItems={allItems}
              searchTerm={searchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedNeighborhood={selectedNeighborhood}
              onNeighborhoodChange={setSelectedNeighborhood}
              selectedVillage={selectedVillage}
              onVillageChange={setSelectedVillage}
              eventDateRange={eventDateRange}
              onEventDateRangeChange={setEventDateRange}
              selectedEventDates={selectedEventDates}
              onSelectedEventDatesChange={setSelectedEventDates}
              filteredItemsCount={filteredItems.length}
              itemType="events"
            />
          </div>
        </div>

        {/* Bottom grid - only show when in map view on all screen sizes */}
        <>
          {isLoading ? (
            <div className="text-center py-6 md:py-8">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm md:text-base text-gray-600">Loading content...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 mt-4 md:mt-6">
              {filteredItems.map(renderItem)}
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 text-gray-500">
              <p className="text-sm md:text-base">No content found. Try adjusting your filters or be the first to add something!</p>
            </div>
          )}
        </>
      </div>
      
      {/* Translation Test Toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowTranslationTest(!showTranslationTest)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors text-sm"
        >
          {showTranslationTest ? 'Hide' : 'Test'} Translations
        </button>
      </div>

      {/* Translation Test Modal */}
      {showTranslationTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Translation Test</h2>
              <button
                onClick={() => setShowTranslationTest(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <TestTranslation />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
