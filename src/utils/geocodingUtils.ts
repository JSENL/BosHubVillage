
export const geocodeAddresses = async (addresses: string[], apiKey: string): Promise<{ lat: number; lng: number; address: string }[]> => {
  const results: { lat: number; lng: number; address: string }[] = [];
  
  for (const address of addresses) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        results.push({
          lat: location.lat,
          lng: location.lng,
          address: address
        });
        console.log(`Geocoded ${address}:`, location);
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
