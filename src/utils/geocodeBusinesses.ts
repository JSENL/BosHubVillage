
import { GeocodeResult } from '@/hooks/useGeocoding';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BusinessToGeocode {
  id: string;
  address: string;
  title: string;
  latitude?: number | null;
  longitude?: number | null;
}

export const geocodeBusinesses = async (
  businesses: BusinessToGeocode[],
  geocodeFunction: (address: string) => Promise<GeocodeResult | null>
): Promise<void> => {
  console.log(`🌍 Starting geocoding for ${businesses.length} businesses`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const business of businesses) {
    try {
      console.log(`🔍 Geocoding business: ${business.title} at ${business.address}`);
      
      const result = await geocodeFunction(business.address);
      
      if (result) {
        // Update the business with the geocoded coordinates
        const { error } = await supabase
          .from('business')
          .update({
            latitude: result.latitude,
            longitude: result.longitude
          })
          .eq('id', business.id);

        if (error) {
          console.error(`❌ Error updating business ${business.title}:`, error);
          failureCount++;
        } else {
          console.log(`✅ Successfully geocoded and updated business: ${business.title}`);
          successCount++;
        }
      } else {
        console.warn(`⚠️ Failed to geocode business: ${business.title}`);
        failureCount++;
      }
      
      // Add a small delay to avoid overwhelming the geocoding service
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error geocoding business ${business.title}:`, error);
      failureCount++;
    }
  }
  
  console.log(`🎯 Geocoding complete: ${successCount} successful, ${failureCount} failed`);
  
  if (successCount > 0) {
    toast.success(`Successfully geocoded ${successCount} businesses`);
  }
  if (failureCount > 0) {
    toast.error(`Failed to geocode ${failureCount} businesses`);
  }
};

export const geocodeAllBusinesses = async (
  geocodeFunction: (address: string) => Promise<GeocodeResult | null>
): Promise<void> => {
  console.log('🚀 Starting to geocode all businesses');
  
  try {
    // Fetch all businesses that need geocoding (missing coordinates or have invalid coordinates)
    const { data: businesses, error } = await supabase
      .from('business')
      .select('id, title, address, latitude, longitude')
      .or('latitude.is.null,longitude.is.null');

    if (error) {
      console.error('❌ Error fetching businesses:', error);
      toast.error('Failed to fetch businesses for geocoding');
      return;
    }

    if (!businesses || businesses.length === 0) {
      console.log('✅ No businesses need geocoding');
      toast.success('All businesses already have coordinates');
      return;
    }

    console.log(`📍 Found ${businesses.length} businesses that need geocoding`);
    
    // Convert to the expected format
    const businessesToGeocode: BusinessToGeocode[] = businesses.map(business => ({
      id: business.id,
      address: business.address,
      title: business.title,
      latitude: business.latitude,
      longitude: business.longitude
    }));

    // Start geocoding process
    await geocodeBusinesses(businessesToGeocode, geocodeFunction);
    
  } catch (error) {
    console.error('❌ Error in geocodeAllBusinesses:', error);
    toast.error('Failed to geocode businesses');
  }
};
