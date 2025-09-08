import React from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { UnifiedItemCard } from './UnifiedItemCard';
import { createMarkerElement } from '@/utils/mapMarkerCreator';

// Test component to verify sponsored functionality
export const TestSponsoredComponents = () => {
  const sponsoredTestItem: UnifiedItem = {
    id: 'test-sponsored',
    title: 'Test Sponsored Event',
    description: 'This is a test sponsored event to verify functionality',
    latitude: 42.3601,
    longitude: -71.0589,
    type: 'event',
    category: 'Test',
    is_sponsored: true
  };

  const regularTestItem: UnifiedItem = {
    id: 'test-regular',
    title: 'Test Regular Event',
    description: 'This is a test regular event for comparison',
    latitude: 42.3601,
    longitude: -71.0589,
    type: 'event',
    category: 'Test',
    is_sponsored: false
  };

  React.useEffect(() => {
    console.log('🧪 Testing sponsored marker creation...');
    
    // Test sponsored marker
    const sponsoredMarker = createMarkerElement(sponsoredTestItem);
    console.log('✨ Sponsored marker element:', sponsoredMarker);
    
    // Test regular marker
    const regularMarker = createMarkerElement(regularTestItem);
    console.log('📍 Regular marker element:', regularMarker);
    
    // Test the marker elements visually in the console
    document.body.appendChild(sponsoredMarker);
    sponsoredMarker.style.position = 'fixed';
    sponsoredMarker.style.top = '10px';
    sponsoredMarker.style.left = '10px';
    sponsoredMarker.style.zIndex = '9999';
    
    document.body.appendChild(regularMarker);
    regularMarker.style.position = 'fixed';
    regularMarker.style.top = '10px';
    regularMarker.style.left = '100px';
    regularMarker.style.zIndex = '9999';
    
    console.log('🧪 Test markers added to page for visual verification');
    
    return () => {
      document.body.removeChild(sponsoredMarker);
      document.body.removeChild(regularMarker);
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Sponsored Component Tests</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Sponsored Card</h3>
          <UnifiedItemCard item={sponsoredTestItem} viewMode="grid" />
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Regular Card</h3>
          <UnifiedItemCard item={regularTestItem} viewMode="grid" />
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">
          Check the console and look for test markers in the top-left corner to verify sponsored effects are working.
        </p>
      </div>
    </div>
  );
};