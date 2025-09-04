
export const geocodeAddresses = async (addresses: string[], apiKey: string): Promise<{ lat: number; lng: number; address: string }[]> => {
  const results: { lat: number; lng: number; address: string }[] = [];
  
  for (const address of addresses) {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${apiKey}&limit=1`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [longitude, latitude] = feature.center;
        results.push({
          lat: latitude,
          lng: longitude,
          address: address
        });
        console.log(`Geocoded ${address}:`, { latitude, longitude });
      } else {
        console.warn(`Could not geocode address: ${address}`);
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error geocoding ${address}:`, error);
    }
  }
  
  return results;
};
