import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MapboxTest = () => {
  const [status, setStatus] = useState('Checking...');
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testMapboxToken = async () => {
    try {
      setStatus('Fetching Mapbox token...');
      setError(null);
      
      console.log('🧪 Testing Mapbox token retrieval...');
      
      const { data, error } = await supabase.functions.invoke('get-mapbox-key');
      
      if (error) {
        console.error('❌ Edge function error:', error);
        setError(`Edge function error: ${error.message}`);
        setStatus('Failed');
        return;
      }

      console.log('📦 Response from edge function:', data);

      if (data?.mapboxKey) {
        setToken(data.mapboxKey);
        setStatus('✅ Success! Mapbox token retrieved');
        console.log('✅ Mapbox token retrieved successfully');
      } else {
        console.error('❌ No mapboxKey in response:', data);
        setError('No mapboxKey in response');
        setStatus('Failed');
      }
    } catch (err) {
      console.error('❌ Request failed:', err);
      setError(`Request failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('Failed');
    }
  };

  useEffect(() => {
    testMapboxToken();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Mapbox Token Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> 
          <span className={
            status.includes('Success') ? 'text-green-600 ml-2' : 
            status.includes('Failed') ? 'text-red-600 ml-2' : 
            'text-yellow-600 ml-2'
          }>
            {status}
          </span>
        </div>
        
        {token && (
          <div>
            <strong>Token Preview:</strong> 
            <code className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">
              {token.substring(0, 20)}...
            </code>
          </div>
        )}
        
        {error && (
          <div className="text-red-600">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <Button onClick={testMapboxToken} className="w-full">
          Test Again
        </Button>
      </CardContent>
    </Card>
  );
};