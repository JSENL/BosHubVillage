
import { supabase } from '@/integrations/supabase/client';

// Geocode news items that don't have coordinates
export const geocodeNewsItems = async (newsItems: any[], geocode: (address: string) => Promise<any>) => {
  const newsWithoutCoords = newsItems.filter(news => !news.latitude || !news.longitude);
  
  for (const news of newsWithoutCoords) {
    if (news.Address || news.location) {
      const addressToGeocode = news.Address || news.location;
      console.log('Geocoding news address:', addressToGeocode);
      
      try {
        const result = await geocode(addressToGeocode);
        if (result) {
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
            // Update the local item
            news.latitude = result.latitude;
            news.longitude = result.longitude;
          }
        }
      } catch (error) {
        console.error('Error geocoding news address:', error);
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
};
