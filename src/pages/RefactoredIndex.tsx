import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { FilterSection } from "@/components/home/FilterSection";
import { ContentSection } from "@/components/home/ContentSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { useHomePageFilters } from "@/hooks/useHomePageFilters";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeEvents } from "@/utils/geocodeEvents";
import { geocodeNewsItems } from "@/utils/geocodeNewsItems";
import { geocodeBusinesses } from "@/utils/geocodeBusinesses";
import { UnifiedItem } from "@/types/unifiedItem";
import { useEvents } from "@/hooks/useEvents";
import { useNews } from "@/hooks/useNews";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { sortBySponsored } from "@/utils/sponsoredUtils";

const RefactoredIndex = () => {
  const { filters, actions } = useHomePageFilters();
  const { events, loading: eventsLoading } = useEvents();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { submissions: businessSubmissions, loading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { data: localServices, isLoading: localServicesLoading } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading } = useLocalServiceSubmissions();
  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedItems, setHasGeocodedItems] = useState(false);

  const isLoading = eventsLoading || newsLoading || businessLoading || 
                   businessSubmissionsLoading || localServicesLoading || 
                   localServiceSubmissionsLoading;

  const data = {
    events,
    news,
    businesses,
    businessSubmissions,
    localServices,
    localServiceSubmissions
  };

  const loading = { isLoading };

  // Geocoding effect - same logic as original
  useEffect(() => {
    if (!isReady || hasGeocodedItems || loading.isLoading) return;

    const geocodeItemsIfNeeded = async () => {
      try {
        // Geocode events
        const eventsNeedingGeocode = (data.events || []).filter(event => 
          (!event.latitude || !event.longitude) && event.location
        );
        if (eventsNeedingGeocode.length > 0) {
          await geocodeEvents(eventsNeedingGeocode, geocode);
        }

        // Geocode news
        const newsNeedingGeocode = (data.news || []).filter(newsItem => 
          newsItem.location && 
          newsItem.location.trim() !== '' &&
          (!newsItem.latitude || !newsItem.longitude || 
           newsItem.latitude === null || newsItem.longitude === null)
        );
        if (newsNeedingGeocode.length > 0) {
          await geocodeNewsItems(newsNeedingGeocode, geocode);
        }

        // Geocode businesses
        const businessesNeedingGeocode = (data.businesses || []).filter(business => 
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
  }, [data.events, data.news, data.businesses, isReady, geocode, hasGeocodedItems, loading.isLoading]);

  // Create unified items - same logic as original
  const allItems: UnifiedItem[] = [
    // Events
    ...(data.events || []).map((event: any) => ({
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
      villages: event.villages,
      is_sponsored: event.is_sponsored,
      originalData: event
    })),
    // News
    ...(data.news || []).map((newsItem: any) => ({
      id: newsItem.id,
      title: newsItem.title,
      description: newsItem.content || newsItem.excerpt,
      latitude: newsItem.latitude,
      longitude: newsItem.longitude,
      type: 'news' as const,
      location: newsItem.location,
      category: newsItem.category,
      neighborhoods: newsItem.neighborhoods,
      villages: newsItem.villages,
      is_sponsored: newsItem.is_sponsored,
      originalData: newsItem
    })),
    // Businesses
    ...(data.businesses || []).map((business: any) => ({
      id: business.id,
      title: business.title || business.name,
      description: business.description,
      latitude: business.latitude,
      longitude: business.longitude,
      type: 'business' as const,
      address: business.address,
      category: business.business_type,
      business_type: business.business_type,
      neighborhoods: business.neighborhoods,
      villages: business.villages,
      is_sponsored: business.is_sponsored,
      originalData: business
    })),
    // Local Services
    ...(data.localServices || []).map((service: any) => ({
      id: service.id,
      title: service.name,
      description: service.description,
      latitude: service.latitude,
      longitude: service.longitude,
      type: 'local-service' as const,
      location: service.location,
      category: service.category,
      neighborhoods: service.neighborhoods,
      villages: service.villages,
      is_sponsored: service.is_sponsored,
      originalData: service
    }))
  ];

  // Filter items - same logic as original
  const filteredItems = allItems.filter(item => {
    // Exclude past events
    if (item.type === 'event' && item.date) {
      const eventDate = new Date(item.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (eventDate < today) {
        return false;
      }
    }

    // Type filter
    const matchesType = filters.selectedType === 'all' || item.type === filters.selectedType;

    // Search filter
    const searchLower = filters.searchTerm.toLowerCase();
    const matchesSearch = !filters.searchTerm || 
      item.title.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.category && item.category.toLowerCase().includes(searchLower)) ||
      (item.location && item.location.toLowerCase().includes(searchLower)) ||
      (item.address && item.address.toLowerCase().includes(searchLower));

    // Category filter
    const matchesCategory = filters.selectedCategory === 'all' || 
      (item.category && item.category === filters.selectedCategory) ||
      (item.business_type && item.business_type === filters.selectedCategory);

    // Neighborhood filter
    const matchesNeighborhood = filters.selectedNeighborhood === 'all' || 
      (item.neighborhoods && item.neighborhoods.includes(filters.selectedNeighborhood));

    // Village filter
    const matchesVillage = filters.selectedVillage === 'all' || 
      (item.villages && (
        (Array.isArray(item.villages) && item.villages.includes(filters.selectedVillage)) ||
        (typeof item.villages === 'string' && item.villages.includes(filters.selectedVillage))
      ));

    return matchesType && matchesSearch && matchesCategory && matchesNeighborhood && matchesVillage;
  });

  // Sort filtered items so sponsored items appear first
  const sortedFilteredItems = sortBySponsored(filteredItems);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Local Community</h2>
          
          {/* Featured Section - shows sponsored items */}
          <FeaturedSection items={allItems} />
          
          <FilterSection
            filters={filters}
            allItems={allItems}
            filteredItemsCount={sortedFilteredItems.length}
            onSearchChange={actions.setSearchTerm}
            onTypeChange={actions.setSelectedType}
            onCategoryChange={actions.setSelectedCategory}
            onNeighborhoodChange={actions.setSelectedNeighborhood}
            onVillageChange={actions.setSelectedVillage}
            onViewModeChange={actions.setViewMode}
            onEventDateRangeChange={actions.setEventDateRange}
            onSelectedEventDatesChange={actions.setSelectedEventDates}
          />

          <ContentSection
            filters={filters}
            allItems={allItems}
            filteredItems={sortedFilteredItems}
            isLoading={loading.isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RefactoredIndex;