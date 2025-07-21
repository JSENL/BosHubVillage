import { useState, useEffect } from "react";
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
import { useNewsSubmissions } from "@/hooks/useNewsSubmissions";
import { useBusiness } from "@/hooks/useBusiness";
import { useBusinessSubmissions } from "@/hooks/useBusinessSubmissions";
import { useLocalServices } from "@/hooks/useLocalServices";
import { useLocalServiceSubmissions } from "@/hooks/useLocalServiceSubmissions";
import { useGeocoding } from "@/hooks/useGeocoding";
import { geocodeEvents } from "@/utils/geocodeEvents";
import { geocodeNewsItems } from "@/utils/geocodeNewsItems";
import { geocodeBusinesses } from "@/utils/geocodeBusinesses";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { UnifiedItem } from "@/types/unifiedItem";
import { EnhancedUniversalMap } from "@/components/EnhancedUniversalMap";

const Index = () => {
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Data hooks - using correct property names based on actual hook implementations
  const { events, loading: eventsLoading } = useEvents();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: newsSubmissions, isLoading: newsSubmissionsLoading } = useNewsSubmissions();
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { data: localServices, isLoading: localServicesLoading } = useLocalServices();
  const { data: localServiceSubmissions, isLoading: localServiceSubmissionsLoading } = useLocalServiceSubmissions();

  const { geocode, isReady } = useGeocoding();
  const [hasGeocodedItems, setHasGeocodedItems] = useState(false);

  // Combine all data into unified items
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
    ...(news || []).map(newsItem => ({
      id: newsItem.id,
      title: newsItem.title,
      description: newsItem.content || '',
      latitude: newsItem.latitude,
      longitude: newsItem.longitude,
      type: 'news' as const,
      location: newsItem.location,
      address: newsItem.Address || newsItem.location,
      content: newsItem.content,
      source: newsItem.source,
      villages: newsItem.villages,
      date: newsItem.date_posted,
      originalData: newsItem
    })),
    ...(newsSubmissions || []).map(newsSubmission => ({
      id: newsSubmission.id,
      title: newsSubmission.title,
      description: newsSubmission.content || '',
      latitude: newsSubmission.latitude,
      longitude: newsSubmission.longitude,
      type: 'news' as const,
      location: newsSubmission.location,
      address: newsSubmission.Address || newsSubmission.location,
      content: newsSubmission.content,
      source: newsSubmission.source,
      villages: newsSubmission.villages,
      date: newsSubmission.date_posted,
      originalData: newsSubmission
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

  const isLoading = eventsLoading || newsLoading || newsSubmissionsLoading || 
                   businessLoading || businessSubmissionsLoading ||
                   localServicesLoading || localServiceSubmissionsLoading;

  // Filter items based on criteria
  const filteredItems = allItems.filter(item => {
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

    // Village filter
    const matchesVillage = selectedVillage === 'all' || (() => {
      if (!item.villages) return false;
      const itemVillages = Array.isArray(item.villages) ? item.villages : [item.villages];
      return itemVillages.some(village => 
        village.toLowerCase().replace(/\s+/g, '-') === selectedVillage ||
        village.toLowerCase() === selectedVillage.replace('-', ' ').toLowerCase()
      );
    })();

    return matchesType && matchesSearch && matchesCategory && matchesNeighborhood && matchesVillage;
  });

  // Create filtered items for map (excluding news)
  const mapItems = filteredItems.filter(item => item.type !== 'news');

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

  const renderItem = (item: UnifiedItem) => {
    switch (item.type) {
      case 'event':
        return <EventCard key={item.id} event={item.originalData} viewMode="grid" />;
      case 'news':
        return <NewsCard key={item.id} news={item.originalData} />;
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
    : selectedType === 'news' 
      ? [] 
      : [selectedType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection title="Welcome to LocalEvents" subtitle="Discover amazing events, businesses, and news in your area" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Local Community</h2>
          
          <EnhancedUniversalMap 
            items={mapItems}
            height="400px"
            selectedTypes={selectedTypesForMap}
          />
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search all content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          <UniversalFilters
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedNeighborhood={selectedNeighborhood}
            onNeighborhoodChange={setSelectedNeighborhood}
            selectedVillage={selectedVillage}
            onVillageChange={setSelectedVillage}
            filteredItemsCount={filteredItems.length}
            itemType="events"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredItems.map(renderItem)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No content found. Try adjusting your filters or be the first to add something!
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
