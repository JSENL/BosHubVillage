
export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

export const geocodeAddress = async (address: string, apiKey: string): Promise<GeocodeResult | null> => {
  if (!address || !apiKey) {
    console.error('Address or API key missing for geocoding');
    return null;
  }

  try {
    console.log('Geocoding address:', address);
    
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      console.log('Geocoding successful:', location);
      
      return {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: result.formatted_address
      };
    } else {
      console.error('Geocoding failed:', data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error('Error during geocoding:', error);
    return null;
  }
};
