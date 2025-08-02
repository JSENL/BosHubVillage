import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MapboxContextType {
  mapboxToken: string | null;
  isLoadingApiKey: boolean;
  error: string | null;
}

const MapboxContext = createContext<MapboxContextType | undefined>(undefined);

export const MapboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        if (data?.apiKey) {
          console.log('✅ Mapbox API key fetched successfully');
          setMapboxToken(data.apiKey);
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
  }, []);

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