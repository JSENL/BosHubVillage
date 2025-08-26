import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
import { UnifiedItem } from "@/types/unifiedItem";

interface DataContextType {
  allItems: UnifiedItem[];
  isLoading: boolean;
  events: any[];
  news: any[];
  businesses: any[];
  businessSubmissions: any[];
  localServices: any[];
  localServiceSubmissions: any[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
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

  const value = {
    allItems,
    isLoading,
    events: events || [],
    news: news || [],
    businesses: businesses || [],
    businessSubmissions: businessSubmissions || [],
    localServices: localServices || [],
    localServiceSubmissions: localServiceSubmissions || []
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};