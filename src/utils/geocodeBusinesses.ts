import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { GeocodeResult } from '@/hooks/useGeocoding';

export const geocodeBusinesses = async (
  businesses: Business[],
  geocodeFunction: (address: string) => Promise<GeocodeResult | null>
) => {
  console.log(`Starting geocoding for ${businesses.length} businesses`);
  
  for (const business of businesses) {
    try {
      if (!business.address || business.address.trim() === '') {
        console.warn(`Skipping business ${business.id}: No address provided`);
        continue;
      }

      console.log(`Geocoding business: ${business.title} at ${business.address}`);
      
      const result = await geocodeFunction(business.address);
      
      if (result) {
        const { data, error } = await supabase
          .from('business')
          .update({
            latitude: result.latitude,
            longitude: result.longitude
          })
          .eq('id', business.id);
          
        if (error) {
          console.error(`Failed to update coordinates for business ${business.id}:`, error);
        } else {
          console.log(`Successfully geocoded business: ${business.title}`);
        }
      } else {
        console.warn(`No geocoding result for business: ${business.title}`);
      }
    } catch (error) {
      console.error(`Error geocoding business ${business.title}:`, error);
    }
  }
  
  console.log('Finished geocoding businesses');
};

export const geocodeAllBusinesses = async (
  geocodeFunction: (address: string) => Promise<GeocodeResult | null>
) => {
  try {
    const { data: businesses, error } = await supabase
      .from('business')
      .select('*');

    if (error) throw error;

    if (!businesses || businesses.length === 0) {
      console.log('No businesses found for geocoding');
      return;
    }

    const businessesNeedingGeocode = businesses.filter(business => 
      business.address && 
      business.address.trim() !== '' &&
      (!business.latitude || !business.longitude || 
       business.latitude === null || business.longitude === null ||
       Number(business.latitude) === 0 || Number(business.longitude) === 0)
    ).map(business => ({
      ...business,
      villages: business.villages ? (typeof business.villages === 'string' ? JSON.parse(business.villages) : business.villages) : null
    }));

    if (businessesNeedingGeocode.length === 0) {
      console.log('All businesses already have coordinates');
      return;
    }

    console.log(`Found ${businessesNeedingGeocode.length} businesses needing geocoding`);
    await geocodeBusinesses(businessesNeedingGeocode as Business[], geocodeFunction);
  } catch (error) {
    console.error('Error in geocodeAllBusinesses:', error);
    throw error;
  }
};