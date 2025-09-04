
// Mapbox-only geocoding utility
export const geocodeAddress = async (address: string, apiKey: string): Promise<{ lat: number; lng: number } | null> => {
  if (!address || !apiKey) {
    console.error('Address or API key missing for geocoding');
    return null;
  }

  try {
    console.log('Geocoding address with Mapbox:', address);
    
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}&limit=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [longitude, latitude] = feature.center;
      
      console.log('Mapbox geocoding successful:', { latitude, longitude });
      
      return {
        lat: latitude,
        lng: longitude
      };
    } else {
      console.error('Mapbox geocoding failed: No results found');
      return null;
    }
  } catch (error) {
    console.error('Error during Mapbox geocoding:', error);
    return null;
  }
};
