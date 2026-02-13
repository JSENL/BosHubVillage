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

    let cancelled = false;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    const fetchMapboxToken = async (isRetry = false) => {
      try {
        if (!isRetry) {
          console.log('🗝️ Fetching Mapbox API key from edge function...');
        } else {
          console.log('🗝️ Retrying Mapbox API key fetch...');
        }

        const { data, error: invokeError } = await supabase.functions.invoke('get-mapbox-key');

        if (cancelled) return;

        if (invokeError) {
          console.error('Error fetching Mapbox API key:', invokeError);
          const cached = getCachedToken();
          if (cached) {
            setMapboxToken(cached);
            setError(null);
            console.log('✅ Using cached Mapbox token after fetch error');
          } else if (!isRetry) {
            setError('Failed to fetch Mapbox API key. Set MAPBOX_PUBLIC_KEY in Supabase Edge Function secrets.');
            retryTimeout = setTimeout(() => fetchMapboxToken(true), 2500);
            return;
          } else {
            setError('Failed to fetch Mapbox API key. Set MAPBOX_PUBLIC_KEY in Supabase Edge Function secrets.');
          }
          setIsLoadingApiKey(false);
          return;
        }

        if (data?.mapboxKey) {
          console.log('✅ Mapbox API key fetched successfully');
          setMapboxToken(data.mapboxKey);
          setCachedToken(data.mapboxKey);
          setError(null);
        } else {
          const cached = getCachedToken();
          if (cached) {
            setMapboxToken(cached);
            setError(null);
          } else {
            console.error('No API key returned from edge function');
            setError('MAPBOX_PUBLIC_KEY not set. Add it in Supabase → Project Settings → Edge Functions → Secrets.');
          }
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error calling edge function:', err);
        const cached = getCachedToken();
        if (cached) {
          setMapboxToken(cached);
          setError(null);
        } else if (!isRetry) {
          setError('Failed to connect to API service');
          retryTimeout = setTimeout(() => fetchMapboxToken(true), 2500);
          return;
        } else {
          setError('Failed to connect to API service. Check Supabase and set MAPBOX_PUBLIC_KEY in Edge Function secrets.');
        }
      } finally {
        if (!cancelled) setIsLoadingApiKey(false);
      }
    };

    fetchMapboxToken();
    return () => {
      cancelled = true;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
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
