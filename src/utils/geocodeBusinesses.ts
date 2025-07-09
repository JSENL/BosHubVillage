
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BusinessToGeocode {
  id: string;
  address: string;
  title: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

export const geocodeBusinesses = async (
  businesses: BusinessToGeocode[],
  geocodeFunction: (address: string) => Promise<GeocodeResult | null>
): Promise<void> => {
  console.log(`🌍 Starting geocoding for ${businesses.length} business`);
  
  if (businesses.length === 0) {
    console.log('No business to geocode');
    return;
  }

  let successCount = 0;
  let failCount = 0;
  const geocodePromises = businesses.map(async (business, index) => {
    try {
      console.log(`📍 Geocoding business ${index + 1}/${businesses.length}: "${business.title}" at "${business.address}"`);
      
      // Skip if already has valid coordinates
      if (business.latitude && business.longitude && 
          Number(business.latitude) !== 0 && Number(business.longitude) !== 0) {
        console.log(`✅ Business "${business.title}" already has coordinates: ${business.latitude}, ${business.longitude}`);
        return;
      }

      const result = await geocodeFunction(business.address);
      
      if (result && result.latitude && result.longitude) {
        console.log(`✅ Geocoded "${business.title}": ${result.latitude}, ${result.longitude}`);
        
        // Update business with coordinates
        const { error } = await supabase
          .from('business')
          .update({
            latitude: result.latitude,
            longitude: result.longitude
          })
          .eq('id', business.id);

        if (error) {
          console.error(`❌ Failed to update coordinates for "${business.title}":`, error);
          failCount++;
          return;
        }

        successCount++;
        console.log(`💾 Saved coordinates for "${business.title}"`);
      } else {
        console.warn(`⚠️ Failed to geocode "${business.title}" with address "${business.address}"`);
        failCount++;
      }
    } catch (error) {
      console.error(`❌ Error geocoding business "${business.title}":`, error);
      failCount++;
    }
  });

  await Promise.all(geocodePromises);
  
  console.log(`🎯 Geocoding complete: ${successCount} successful, ${failCount} failed`);
  
  if (successCount > 0) {
    toast.success(`Successfully geocoded ${successCount} business!`);
  }
  if (failCount > 0) {
    toast.warning(`Failed to geocode ${failCount} business. Check addresses and try again.`);
  }
};

export const geocodeAllBusinesses = async (
  geocodeFunction: (address: string) => Promise<GeocodeResult | null>
): Promise<void> => {
  console.log('🚀 Starting to geocode all business');
  
  try {
    // Fetch all business that need geocoding
    const { data: businesses, error } = await supabase
      .from('business')
      .select('id, title, address, latitude, longitude')
      .or('latitude.is.null,longitude.is.null,latitude.eq.0,longitude.eq.0');

    if (error) {
      console.error('❌ Error fetching business:', error);
      toast.error('Failed to fetch business for geocoding');
      return;
    }

    if (!businesses || businesses.length === 0) {
      console.log('✅ No business need geocoding');
      toast.success('All business already have coordinates');
      return;
    }

    console.log(`📍 Found ${businesses.length} business that need geocoding`);
    
    // Convert to the expected format
    const businessesToGeocode: BusinessToGeocode[] = businesses
      .filter(business => business.address && business.address.trim() !== '')
      .map(business => ({
        id: business.id,
        address: business.address,
        title: business.title,
        latitude: business.latitude,
        longitude: business.longitude
      }));

    if (businessesToGeocode.length === 0) {
      toast.warning('No business found with valid addresses to geocode');
      return;
    }

    // Start geocoding process
    await geocodeBusinesses(businessesToGeocode, geocodeFunction);
    
  } catch (error) {
    console.error('❌ Error in geocodeAllBusinesses:', error);
    toast.error('Failed to geocode business');
  }
};
