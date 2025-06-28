
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const geocodeAllNews = async (geocode: (address: string) => Promise<any>) => {
  console.log('Starting to geocode all news items...');
  
  try {
    // Fetch all news items that don't have coordinates but have an address or location
    const { data: newsItems, error } = await supabase
      .from('news')
      .select('*')
      .or('latitude.is.null,longitude.is.null')
      .not('Address', 'is', null)
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching news items:', error);
      toast.error('Failed to fetch news items for geocoding');
      return;
    }

    if (!newsItems || newsItems.length === 0) {
      console.log('No news items found that need geocoding');
      toast.info('All news items already have coordinates');
      return;
    }

    console.log(`Found ${newsItems.length} news items to geocode`);
    let successCount = 0;
    let errorCount = 0;

    // Process each news item
    for (const news of newsItems) {
      const addressToGeocode = news.Address || news.location;
      
      if (!addressToGeocode) {
        console.log(`Skipping news item ${news.id} - no address or location`);
        continue;
      }

      console.log(`Geocoding news item ${news.id}: ${addressToGeocode}`);
      
      try {
        const result = await geocode(addressToGeocode);
        
        if (result && result.latitude && result.longitude) {
          // Update the news item with coordinates
          const { error: updateError } = await supabase
            .from('news')
            .update({
              latitude: result.latitude,
              longitude: result.longitude
            })
            .eq('id', news.id);

          if (updateError) {
            console.error(`Error updating coordinates for news ${news.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Successfully geocoded and updated news ${news.id}`);
            successCount++;
          }
        } else {
          console.warn(`Could not geocode address for news ${news.id}: ${addressToGeocode}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error geocoding news ${news.id}:`, error);
        errorCount++;
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`Geocoding complete. Success: ${successCount}, Errors: ${errorCount}`);
    
    if (successCount > 0) {
      toast.success(`Successfully geocoded ${successCount} news items!`);
    }
    
    if (errorCount > 0) {
      toast.warning(`Failed to geocode ${errorCount} news items`);
    }

  } catch (error) {
    console.error('Error in geocodeAllNews:', error);
    toast.error('Failed to geocode news items');
  }
};
