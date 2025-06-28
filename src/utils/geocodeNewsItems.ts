
import { supabase } from '@/integrations/supabase/client';

// Geocode news items that don't have coordinates
export const geocodeNewsItems = async (newsItems: any[], geocode: (address: string) => Promise<any>) => {
  const newsWithoutCoords = newsItems.filter(news => 
    (!news.latitude || !news.longitude || news.latitude === null || news.longitude === null) && 
    (news.Address || news.location)
  );
  
  console.log(`Found ${newsWithoutCoords.length} news items without coordinates to geocode`);
  
  for (const news of newsWithoutCoords) {
    const addressToGeocode = news.Address || news.location;
    console.log('Geocoding news address:', addressToGeocode);
    
    try {
      const result = await geocode(addressToGeocode);
      if (result && result.latitude && result.longitude) {
        // Update news item in database with coordinates
        const { error } = await supabase
          .from('news')
          .update({
            latitude: result.latitude,
            longitude: result.longitude
          })
          .eq('id', news.id);

        if (error) {
          console.error('Error updating news coordinates:', error);
        } else {
          console.log('Successfully updated news coordinates for:', news.title);
          // Update the local item immediately
          news.latitude = result.latitude;
          news.longitude = result.longitude;
        }
      } else {
        console.warn(`Could not geocode address: ${addressToGeocode}`);
      }
    } catch (error) {
      console.error('Error geocoding news address:', error);
    }
    
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};
