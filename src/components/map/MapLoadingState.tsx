
import { MapPin } from 'lucide-react';

export const MapLoadingState = () => (
  <div className="grid grid-cols-1 gap-6 h-[600px]">
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border border-purple-200 flex items-center justify-center p-8">
      <div className="text-center">
        <MapPin className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Loading Google Maps</h3>
        <p className="text-gray-600">Fetching configuration...</p>
      </div>
    </div>
  </div>
);

export const MapErrorState = () => (
  <div className="grid grid-cols-1 gap-6 h-[600px]">
    <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl border border-red-200 flex items-center justify-center p-8">
      <div className="text-center">
        <MapPin className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-700 mb-4">Google Maps Unavailable</h3>
        <p className="text-gray-600 mb-4">
          Google Maps API key is not configured. Please set the GOOGLE_MAPS_API_KEY in your Supabase environment variables.
        </p>
        <p className="text-sm text-gray-500">
          You can get a Google Maps API key from the Google Cloud Console and add it to your Supabase project's Edge Function secrets.
        </p>
      </div>
    </div>
  </div>
);
