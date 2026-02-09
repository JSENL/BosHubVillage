
import { useState, useCallback } from 'react';
import { useMapboxToken } from '@/contexts/MapboxContext';
import { toast } from 'sonner';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

const GEOCODE_CACHE_KEY = 'geocode_cache';
const GEOCODE_CACHE_MAX = 500;

// In-memory + localStorage cache for geocoding results
const memoryCache = new Map<string, GeocodeResult>();

const loadCache = (): Record<string, GeocodeResult> => {
  try {
    const cached = localStorage.getItem(GEOCODE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      Object.entries(parsed).forEach(([key, value]) => {
        memoryCache.set(key, value as GeocodeResult);
      });
      return parsed;
    }
  } catch { /* ignore */ }
  return {};
};

const saveCache = () => {
  try {
    const obj: Record<string, GeocodeResult> = {};
    // Keep only the most recent entries
    const entries = Array.from(memoryCache.entries());
    const start = Math.max(0, entries.length - GEOCODE_CACHE_MAX);
    entries.slice(start).forEach(([key, value]) => {
      obj[key] = value;
    });
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(obj));
  } catch { /* ignore */ }
};

// Load cache on module init
loadCache();

const normalizeAddress = (address: string): string => {
  return address.trim().toLowerCase().replace(/\s+/g, ' ');
};

const geocodeAddressMapbox = async (address: string, apiKey: string): Promise<GeocodeResult | null> => {
  if (!address || !apiKey) {
    console.error('Address or API key missing for geocoding');
    return null;
  }

  const cacheKey = normalizeAddress(address);
  
  // Check cache first
  if (memoryCache.has(cacheKey)) {
    console.log('📍 Geocode cache hit:', address);
    return memoryCache.get(cacheKey)!;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [longitude, latitude] = feature.center;
      
      const result: GeocodeResult = {
        latitude,
        longitude,
        formatted_address: feature.place_name
      };
      
      // Cache the result
      memoryCache.set(cacheKey, result);
      saveCache();
      
      return result;
    } else {
      console.error('Mapbox geocoding failed: No results found');
      return null;
    }
  } catch (error) {
    console.error('Error during Mapbox geocoding:', error);
    return null;
  }
};

export const useGeocoding = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const { mapboxToken: apiKey } = useMapboxToken();

  const geocode = useCallback(async (address: string): Promise<GeocodeResult | null> => {
    if (!apiKey) {
      console.error('Mapbox API key not available');
      toast.error('Mapbox API not configured');
      return null;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddressMapbox(address, apiKey);
      if (result) {
        return result;
      } else {
        toast.error('Could not find coordinates for this address');
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Failed to geocode address');
      return null;
    } finally {
      setIsGeocoding(false);
    }
  }, [apiKey]);

  return {
    geocode,
    isGeocoding,
    isReady: !!apiKey
  };
};
