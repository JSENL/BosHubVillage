import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MAPBOX_TOKEN_CACHE_KEY = 'mapbox_token_cache';
const MAPBOX_TOKEN_CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CachedToken {
  token: string;
  timestamp: number;
}

const getCachedToken = (): string | null => {
  try {
    const cached = localStorage.getItem(MAPBOX_TOKEN_CACHE_KEY);
    if (!cached) return null;
    const parsed: CachedToken = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > MAPBOX_TOKEN_CACHE_TTL) {
      localStorage.removeItem(MAPBOX_TOKEN_CACHE_KEY);
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
};

const setCachedToken = (token: string) => {
  try {
    localStorage.setItem(MAPBOX_TOKEN_CACHE_KEY, JSON.stringify({ token, timestamp: Date.now() }));
  } catch {
    // localStorage may be unavailable
  }
};

interface MapboxContextType {
  mapboxToken: string | null;
  isLoadingApiKey: boolean;
  error: string | null;
}

const MapboxContext = createContext<MapboxContextType | undefined>(undefined);

export const MapboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(() => getCachedToken());
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(() => !getCachedToken());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetch if we have a valid cached token
    if (mapboxToken) {
      setIsLoadingApiKey(false);
      return;
    }

    const fetchMapboxToken = async () => {
      try {
        console.log('🗝️ Fetching Mapbox API key from edge function...');
        
        const { data, error } = await supabase.functions.invoke('get-mapbox-key');
        
        if (error) {
          console.error('Error fetching Mapbox API key:', error);
          setError('Failed to fetch Mapbox API key');
          setIsLoadingApiKey(false);
          return;
        }

        if (data?.mapboxKey) {
          console.log('✅ Mapbox API key fetched successfully');
          setMapboxToken(data.mapboxKey);
          setCachedToken(data.mapboxKey);
        } else {
          console.error('No API key returned from edge function');
          setError('No API key configured');
        }
      } catch (err) {
        console.error('Error calling edge function:', err);
        setError('Failed to connect to API service');
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchMapboxToken();
  }, [mapboxToken]);

  return (
    <MapboxContext.Provider value={{ mapboxToken, isLoadingApiKey, error }}>
      {children}
    </MapboxContext.Provider>
  );
};

export const useMapboxToken = () => {
  const context = useContext(MapboxContext);
  if (context === undefined) {
    throw new Error('useMapboxToken must be used within a MapboxProvider');
  }
  return context;
};
