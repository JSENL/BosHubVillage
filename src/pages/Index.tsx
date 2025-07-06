
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { UniversalFilters } from "@/components/UniversalFilters";
import { SectionMap } from "@/components/SectionMap";
import { EventCard } from "@/components/EventCard";
import NewsCard from "@/components/NewsCard";
import BusinessCard from "@/components/BusinessCard";
import LocalServiceCard from "@/components/LocalServiceCard";
import LocalServiceSubmissionCard from "@/components/LocalServiceSubmissionCard";
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
import { geocodeLocalServices } from "@/utils/geocodeLocalServices";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { UnifiedItem } from "@/types/unifiedItem";

const Index = () => {
  // Filter states
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Data hooks - using correct property names
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: news, isLoading: newsLoading } = useNews();
  const { data: newsSubmissions, isLoading: newsSubmissionsLoading } = useNewsSubmissions();
  const { data: businesses, isLoading: businessLoading } = useBusiness();
  const { data: businessSubmissions, isLoading: businessSubmissionsLoading } = useBusinessSubmissions();
  const { data: localResources, isLoading: localResourcesLoading } = useLocalServices();
  const { data: localResourceSubmissions, isLoading: localResourceSubmissionsLoading } = useLocalServiceSubmissions();

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
      latitude: null,
      longitude: null,
      type: 'business' as const,
      address: businessSubmission.address,
      category: businessSubmission.business_type,
      business_type: businessSubmission.business_type,
      neighborhoods: businessSubmission.neighborhood,
      originalData: businessSubmission
    })),
    ...(localResources || []).map(resource => ({
      id: resource.id,
      title: resource.name,
      description: resource.description || '',
      latitude: resource.latitude,
      longitude: resource.longitude,
      type: 'local-service' as const,
      address: resource.address,
      category: resource.category,
      name: resource.name,
      neighborhoods: resource.neighborhood,
      villages: resource.village,
      originalData: resource
    })),
    ...(localResourceSubmissions || []).map(resourceSubmission => ({
      id: resourceSubmission.id,
      title: resourceSubmission.name,
      description: resourceSubmission.description || '',
      latitude: resourceSubmission.latitude,
      longitude: resourceSubmission.longitude,
      type: 'local-service' as const,
      address: resourceSubmission.address,
      category: resourceSubmission.category,
      name: resourceSubmission.name,
      neighborhoods: resourceSubmission.neighborhood,
      villages: resourceSubmission.village,
      originalData: resourceSubmission
    }))
  ];

  const isLoading = eventsLoading || newsLoading || newsSubmissionsLoading || 
                   businessLoading || businessSubmissionsLoading || 
                   localResourcesLoading || localResourceSubmissionsLoading;

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

        // Geocode local resources
        const resourcesNeedingGeocode = (localResources || []).filter(resource => 
          (!resource.latitude || !resource.longitude) && resource.address
        );
        if (resourcesNeedingGeocode.length > 0) {
          await geocodeLocalServices(resourcesNeedingGeocode, geocode);
        }

        setHasGeocodedItems(true);
      } catch (error) {
        console.error('Error geocoding items:', error);
      }
    };

    geocodeItemsIfNeeded();
  }, [events, news, businesses, localResources, isReady, geocode, hasGeocodedItems, isLoading]);

  const renderItem = (item: UnifiedItem) => {
    switch (item.type) {
      case 'event':
        return <EventCard key={item.id} event={item.originalData} viewMode="grid" />;
      case 'news':
        return <NewsCard key={item.id} news={item.originalData} />;
      case 'business':
        if ('status' in item.originalData) {
          return <div key={item.id}>Business Submission Card</div>; // You might want to create a proper component
        }
        return <BusinessCard key={item.id} business={item.originalData} />;
      case 'local-service':
        if ('status' in item.originalData) {
          return <LocalServiceSubmissionCard key={item.id} submission={item.originalData} onUpdate={() => {}} />;
        }
        return <LocalServiceCard key={item.id} localService={item.originalData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />
      <HeroSection title="Welcome to LocalEvents" subtitle="Discover amazing events, businesses, and news in your area" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Local Community</h2>
          
          <SectionMap height="400px" />
          
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
