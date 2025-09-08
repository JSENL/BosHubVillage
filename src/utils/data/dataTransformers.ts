import { UnifiedItem } from '@/types/unifiedItem';

interface RawDataSources {
  events: any[];
  news: any[];
  businesses: any[];
  businessSubmissions: any[];
  localServices: any[];
  localServiceSubmissions: any[];
}

export const transformDataToUnifiedItems = (data: RawDataSources): UnifiedItem[] => {
  const items: UnifiedItem[] = [];

  // Transform events
  items.push(...data.events.map(event => ({
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
  })));

  // Transform businesses
  items.push(...data.businesses.map(business => ({
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
  })));

  // Transform business submissions
  items.push(...data.businessSubmissions.map(businessSubmission => ({
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
    villages: undefined,
    originalData: businessSubmission
  })));

  // Transform local services
  items.push(...data.localServices.map(localService => ({
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
  })));

  // Transform local service submissions
  items.push(...data.localServiceSubmissions.map(localServiceSubmission => ({
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
  })));

  return items;
};