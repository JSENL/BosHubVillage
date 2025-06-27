
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UnifiedItem {
  id: string;
  title: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  type: 'event' | 'news' | 'business' | 'local-service';
  address?: string;
  location?: string;
  category?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  price?: number;
  neighborhoods?: string;
  villages?: string[] | string;
  business_type?: string;
  name?: string;
  content?: string;
  source?: string;
}

interface UseUnifiedFilteringProps {
  selectedCategory: string;
  selectedNeighborhood: string;
  selectedVillage: string;
  selectedTypes: string[];
  searchTerm: string;
  dateFilter?: string;
  timeFilter?: string;
}

export const useUnifiedFiltering = ({
  selectedCategory,
  selectedNeighborhood,
  selectedVillage,
  selectedTypes,
  searchTerm,
  dateFilter = '',
  timeFilter = 'all'
}: UseUnifiedFilteringProps) => {
  const [allItems, setAllItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to safely parse villages data
  const parseVillages = (villagesData: any): string[] => {
    if (!villagesData) return [];
    
    if (Array.isArray(villagesData)) {
      return villagesData;
    }
    
    if (typeof villagesData === 'string') {
      if (villagesData.trim().startsWith('[') && villagesData.trim().endsWith(']')) {
        try {
          return JSON.parse(villagesData);
        } catch (error) {
          return [];
        }
      } else {
        return [villagesData.trim()];
      }
    }
    
    return [];
  };

  // Fetch all data from Supabase
  const fetchAllData = async () => {
    try {
      console.log('Fetching unified data from all tables...');
      
      const [eventsRes, newsRes, businessRes, localServicesRes] = await Promise.all([
        supabase.from('events').select('*'),
        supabase.from('news').select('*'),
        supabase.from('business').select('*'),
        supabase.from('local_services_nonprofits').select('*')
      ]);

      const items: UnifiedItem[] = [];

      // Process events
      if (eventsRes.data) {
        eventsRes.data.forEach(event => {
          items.push({
            id: event.id,
            title: event.title,
            description: event.description || '',
            latitude: event.latitude ? Number(event.latitude) : null,
            longitude: event.longitude ? Number(event.longitude) : null,
            type: 'event',
            location: event.location,
            category: event.category,
            date: event.date,
            start_time: event.start_time,
            end_time: event.end_time,
            price: Number(event.price || 0),
            neighborhoods: event.neighborhoods,
            villages: event.villages
          });
        });
      }

      // Process news
      if (newsRes.data) {
        newsRes.data.forEach(news => {
          items.push({
            id: news.id,
            title: news.title,
            description: news.content || '',
            latitude: null, // News doesn't have coordinates yet
            longitude: null,
            type: 'news',
            location: news.location,
            content: news.content,
            source: news.source,
            villages: news.villages
          });
        });
      }

      // Process businesses
      if (businessRes.data) {
        businessRes.data.forEach(business => {
          items.push({
            id: business.id,
            title: business.title,
            description: business.description || '',
            latitude: null, // Business doesn't have coordinates yet
            longitude: null,
            type: 'business',
            address: business.address,
            category: business.business_type,
            business_type: business.business_type,
            villages: business.villages
          });
        });
      }

      // Process local services
      if (localServicesRes.data) {
        localServicesRes.data.forEach(service => {
          items.push({
            id: service.id,
            title: service.name,
            description: service.description || '',
            latitude: service.latitude ? Number(service.latitude) : null,
            longitude: service.longitude ? Number(service.longitude) : null,
            type: 'local-service',
            address: service.address,
            category: service.category,
            name: service.name
          });
        });
      }

      console.log('Fetched unified items:', items);
      setAllItems(items);
    } catch (error) {
      console.error('Error fetching unified data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on all criteria
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      // Type filter
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);

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
        const itemVillages = parseVillages(item.villages);
        return itemVillages.some(village => 
          village.toLowerCase().replace(/\s+/g, '-') === selectedVillage ||
          village.toLowerCase() === selectedVillage.replace('-', ' ').toLowerCase()
        );
      })();

      // Date filter (only for events)
      const matchesDate = item.type !== 'event' || dateFilter === '' || item.date === dateFilter;

      // Time filter (only for events)
      const matchesTime = item.type !== 'event' || timeFilter === 'all' || (() => {
        if (!item.start_time) return timeFilter === 'all';
        
        const eventHour = parseInt(item.start_time.split(':')[0]);
        
        switch (timeFilter) {
          case 'morning':
            return eventHour >= 6 && eventHour < 12;
          case 'afternoon':
            return eventHour >= 12 && eventHour < 18;
          case 'evening':
            return eventHour >= 18 || eventHour < 6;
          default:
            return true;
        }
      })();

      return matchesType && matchesSearch && matchesCategory && matchesNeighborhood && matchesVillage && matchesDate && matchesTime;
    });
  }, [allItems, selectedTypes, searchTerm, selectedCategory, selectedNeighborhood, selectedVillage, dateFilter, timeFilter]);

  // Get only items with coordinates for map display
  const mappableItems = useMemo(() => {
    return filteredItems.filter(item => item.latitude !== null && item.longitude !== null);
  }, [filteredItems]);

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    allItems: filteredItems,
    mappableItems,
    loading,
    refetch: fetchAllData
  };
};
