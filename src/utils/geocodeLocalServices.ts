
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const geocodeLocalServices = async (services: any[], geocode: (address: string) => Promise<any>) => {
  const servicesWithoutCoords = services.filter(service => 
    (!service.latitude || !service.longitude || service.latitude === null || service.longitude === null) && 
    service.address
  );
  
  console.log(`Found ${servicesWithoutCoords.length} local services without coordinates to geocode`);
  
  for (const service of servicesWithoutCoords) {
    const addressToGeocode = service.address;
    console.log('Geocoding local service address:', addressToGeocode);
    
    try {
      const result = await geocode(addressToGeocode);
      if (result && result.latitude && result.longitude) {
        // Update service in database with coordinates
        const { error } = await supabase
          .from('local_services_nonprofits')
          .update({
            latitude: result.latitude,
            longitude: result.longitude
          })
          .eq('id', service.id);

        if (error) {
          console.error('Error updating local service coordinates:', error);
        } else {
          console.log('Successfully updated local service coordinates for:', service.name);
          // Update the local service immediately
          service.latitude = result.latitude;
          service.longitude = result.longitude;
        }
      } else {
        console.warn(`Could not geocode address: ${addressToGeocode}`);
      }
    } catch (error) {
      console.error('Error geocoding local service address:', error);
    }
    
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

export const geocodeAllLocalServices = async (geocode: (address: string) => Promise<any>) => {
  console.log('Starting to geocode all local services...');
  
  try {
    // Fetch all local services that don't have coordinates but have an address
    const { data: services, error } = await supabase
      .from('local_services_nonprofits')
      .select('*')
      .or('latitude.is.null,longitude.is.null')
      .not('address', 'is', null);

    if (error) {
      console.error('Error fetching local services:', error);
      toast.error('Failed to fetch local services for geocoding');
      return;
    }

    if (!services || services.length === 0) {
      console.log('No local services found that need geocoding');
      toast.info('All local services already have coordinates');
      return;
    }

    console.log(`Found ${services.length} local services to geocode`);
    let successCount = 0;
    let errorCount = 0;

    // Process each service
    for (const service of services) {
      const addressToGeocode = service.address;
      
      if (!addressToGeocode) {
        console.log(`Skipping service ${service.id} - no address`);
        continue;
      }

      console.log(`Geocoding local service ${service.id}: ${addressToGeocode}`);
      
      try {
        const result = await geocode(addressToGeocode);
        
        if (result && result.latitude && result.longitude) {
          // Update the service with coordinates
          const { error: updateError } = await supabase
            .from('local_services_nonprofits')
            .update({
              latitude: result.latitude,
              longitude: result.longitude
            })
            .eq('id', service.id);

          if (updateError) {
            console.error(`Error updating coordinates for service ${service.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Successfully geocoded and updated service ${service.id}`);
            successCount++;
          }
        } else {
          console.warn(`Could not geocode address for service ${service.id}: ${addressToGeocode}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error geocoding service ${service.id}:`, error);
        errorCount++;
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`Local services geocoding complete. Success: ${successCount}, Errors: ${errorCount}`);
    
    if (successCount > 0) {
      toast.success(`Successfully geocoded ${successCount} local services!`);
    }
    
    if (errorCount > 0) {
      toast.warning(`Failed to geocode ${errorCount} local services`);
    }

  } catch (error) {
    console.error('Error in geocodeAllLocalServices:', error);
    toast.error('Failed to geocode local services');
  }
};
