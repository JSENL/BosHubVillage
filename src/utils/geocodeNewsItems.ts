
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const geocodeNewsItems = async (newsItems: any[], geocode: (address: string) => Promise<any>) => {
  const newsWithoutCoords = newsItems.filter(news => 
    (!news.latitude || !news.longitude || news.latitude === null || news.longitude === null) && 
    news.location
  );
  
  console.log(`Found ${newsWithoutCoords.length} news items without coordinates to geocode`);
  
  for (const news of newsWithoutCoords) {
    const addressToGeocode = news.location;
    console.log('Geocoding news location:', addressToGeocode);
    
    try {
      const result = await geocode(addressToGeocode);
      if (result && result.latitude && result.longitude) {
        // Update news in database with coordinates
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
          // Update the local news item immediately
          news.latitude = result.latitude;
          news.longitude = result.longitude;
        }
      } else {
        console.warn(`Could not geocode location: ${addressToGeocode}`);
      }
    } catch (error) {
      console.error('Error geocoding news location:', error);
    }
    
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

export const geocodeAllNews = async (geocode: (address: string) => Promise<any>) => {
  console.log('Starting to geocode all news items...');
  
  try {
    // Fetch all news that don't have coordinates but have a location
    const { data: newsItems, error } = await supabase
      .from('news')
      .select('*')
      .or('latitude.is.null,longitude.is.null')
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
      const locationToGeocode = news.location;
      
      if (!locationToGeocode) {
        console.log(`Skipping news ${news.id} - no location`);
        continue;
      }

      console.log(`Geocoding news ${news.id}: ${locationToGeocode}`);
      
      try {
        const result = await geocode(locationToGeocode);
        
        if (result && result.latitude && result.longitude) {
          // Update the news with coordinates
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
          console.warn(`Could not geocode location for news ${news.id}: ${locationToGeocode}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error geocoding news ${news.id}:`, error);
        errorCount++;
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`News geocoding complete. Success: ${successCount}, Errors: ${errorCount}`);
    
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
