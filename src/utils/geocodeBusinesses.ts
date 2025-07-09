
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
