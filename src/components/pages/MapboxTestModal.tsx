import { useState } from 'react';
import { MapboxTest } from "@/components/MapboxTest";
import { useAuth } from '@/hooks/useAuth';

export const MapboxTestModal = () => {
  const { isAdmin } = useAuth();
  const [showMapboxTest, setShowMapboxTest] = useState(false);
  
  // Only show for admins
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Mapbox Test Toggle */}
      <div className="fixed bottom-16 right-4 z-50">
        <button
          onClick={() => setShowMapboxTest(!showMapboxTest)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm"
        >
          {showMapboxTest ? 'Hide' : 'Test'} Mapbox
        </button>
      </div>

      {/* Mapbox Test Modal */}
      {showMapboxTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Mapbox Test</h2>
              <button
                onClick={() => setShowMapboxTest(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <MapboxTest />
            </div>
          </div>
        </div>
      )}
    </>
  );
};