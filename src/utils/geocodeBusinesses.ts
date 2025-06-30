
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const geocodeBusinesses = async (businesses: any[], geocode: (address: string) => Promise<any>) => {
  const businessesWithoutCoords = businesses.filter(business => 
    (!business.latitude || !business.longitude || business.latitude === null || business.longitude === null) && 
    business.address
  );
  
  console.log(`Found ${businessesWithoutCoords.length} businesses without coordinates to geocode`);
  
  for (const business of businessesWithoutCoords) {
    const addressToGeocode = business.address;
    console.log('Geocoding business address:', addressToGeocode);
    
    try {
      const result = await geocode(addressToGeocode);
      if (result && result.latitude && result.longitude) {
        // Update business in database with coordinates
        const { error } = await supabase
          .from('business')
          .update({
            latitude: result.latitude,
            longitude: result.longitude
          })
          .eq('id', business.id);

        if (error) {
          console.error('Error updating business coordinates:', error);
        } else {
          console.log('Successfully updated business coordinates for:', business.title);
          // Update the local business immediately
          business.latitude = result.latitude;
          business.longitude = result.longitude;
        }
      } else {
        console.warn(`Could not geocode address: ${addressToGeocode}`);
      }
    } catch (error) {
      console.error('Error geocoding business address:', error);
    }
    
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

export const geocodeAllBusinesses = async (geocode: (address: string) => Promise<any>) => {
  console.log('Starting to geocode all businesses...');
  
  try {
    // Fetch all businesses that don't have coordinates but have an address
    const { data: businesses, error } = await supabase
      .from('business')
      .select('*')
      .or('latitude.is.null,longitude.is.null')
      .not('address', 'is', null);

    if (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to fetch businesses for geocoding');
      return;
    }

    if (!businesses || businesses.length === 0) {
      console.log('No businesses found that need geocoding');
      toast.info('All businesses already have coordinates');
      return;
    }

    console.log(`Found ${businesses.length} businesses to geocode`);
    let successCount = 0;
    let errorCount = 0;

    // Process each business
    for (const business of businesses) {
      const addressToGeocode = business.address;
      
      if (!addressToGeocode) {
        console.log(`Skipping business ${business.id} - no address`);
        continue;
      }

      console.log(`Geocoding business ${business.id}: ${addressToGeocode}`);
      
      try {
        const result = await geocode(addressToGeocode);
        
        if (result && result.latitude && result.longitude) {
          // Update the business with coordinates
          const { error: updateError } = await supabase
            .from('business')
            .update({
              latitude: result.latitude,
              longitude: result.longitude
            })
            .eq('id', business.id);

          if (updateError) {
            console.error(`Error updating coordinates for business ${business.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Successfully geocoded and updated business ${business.id}`);
            successCount++;
          }
        } else {
          console.warn(`Could not geocode address for business ${business.id}: ${addressToGeocode}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error geocoding business ${business.id}:`, error);
        errorCount++;
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`Business geocoding complete. Success: ${successCount}, Errors: ${errorCount}`);
    
    if (successCount > 0) {
      toast.success(`Successfully geocoded ${successCount} businesses!`);
    }
    
    if (errorCount > 0) {
      toast.warning(`Failed to geocode ${errorCount} businesses`);
    }

  } catch (error) {
    console.error('Error in geocodeAllBusinesses:', error);
    toast.error('Failed to geocode businesses');
  }
};
