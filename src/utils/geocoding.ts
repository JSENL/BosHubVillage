
// Note: This file contains Google Maps geocoding functionality
// Currently commented out in favor of Mapbox implementation

/*
import { Loader } from '@googlemaps/js-api-loader';

let googleMapsLoader: Loader | null = null;
let isGoogleMapsLoaded = false;

const initializeGoogleMaps = async (apiKey: string) => {
  if (isGoogleMapsLoaded) return;
  
  if (!googleMapsLoader) {
    googleMapsLoader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }
  
  try {
    await googleMapsLoader.load();
    isGoogleMapsLoaded = true;
  } catch (error) {
    console.error('Error loading Google Maps:', error);
    throw error;
  }
};

export const geocodeAddress = async (address: string, apiKey: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    await initializeGoogleMaps(apiKey);
    
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.error('Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};
*/

// Use Mapbox geocoding instead - this is already implemented in the project
// via the useGeocoding hook and other geocoding utilities
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  console.warn('Google Maps geocoding is disabled. Use Mapbox geocoding utilities instead.');
  return null;
};
