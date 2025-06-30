
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const geocodeEvents = async (events: any[], geocode: (address: string) => Promise<any>) => {
  const eventsWithoutCoords = events.filter(event => 
    (!event.latitude || !event.longitude || event.latitude === null || event.longitude === null) && 
    event.location
  );
  
  console.log(`Found ${eventsWithoutCoords.length} events without coordinates to geocode`);
  
  for (const event of eventsWithoutCoords) {
    const addressToGeocode = event.location;
    console.log('Geocoding event address:', addressToGeocode);
    
    try {
      const result = await geocode(addressToGeocode);
      if (result && result.latitude && result.longitude) {
        // Update event in database with coordinates
        const { error } = await supabase
          .from('events')
          .update({
            latitude: result.latitude,
            longitude: result.longitude
          })
          .eq('id', event.id);

        if (error) {
          console.error('Error updating event coordinates:', error);
        } else {
          console.log('Successfully updated event coordinates for:', event.title);
          // Update the local event immediately
          event.latitude = result.latitude;
          event.longitude = result.longitude;
        }
      } else {
        console.warn(`Could not geocode address: ${addressToGeocode}`);
      }
    } catch (error) {
      console.error('Error geocoding event address:', error);
    }
    
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};

export const geocodeAllEvents = async (geocode: (address: string) => Promise<any>) => {
  console.log('Starting to geocode all events...');
  
  try {
    // Fetch all events that don't have coordinates but have a location
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .or('latitude.is.null,longitude.is.null')
      .not('location', 'is', null);

    if (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events for geocoding');
      return;
    }

    if (!events || events.length === 0) {
      console.log('No events found that need geocoding');
      toast.info('All events already have coordinates');
      return;
    }

    console.log(`Found ${events.length} events to geocode`);
    let successCount = 0;
    let errorCount = 0;

    // Process each event
    for (const event of events) {
      const addressToGeocode = event.location;
      
      if (!addressToGeocode) {
        console.log(`Skipping event ${event.id} - no location`);
        continue;
      }

      console.log(`Geocoding event ${event.id}: ${addressToGeocode}`);
      
      try {
        const result = await geocode(addressToGeocode);
        
        if (result && result.latitude && result.longitude) {
          // Update the event with coordinates
          const { error: updateError } = await supabase
            .from('events')
            .update({
              latitude: result.latitude,
              longitude: result.longitude
            })
            .eq('id', event.id);

          if (updateError) {
            console.error(`Error updating coordinates for event ${event.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`Successfully geocoded and updated event ${event.id}`);
            successCount++;
          }
        } else {
          console.warn(`Could not geocode address for event ${event.id}: ${addressToGeocode}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error geocoding event ${event.id}:`, error);
        errorCount++;
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`Geocoding complete. Success: ${successCount}, Errors: ${errorCount}`);
    
    if (successCount > 0) {
      toast.success(`Successfully geocoded ${successCount} events!`);
    }
    
    if (errorCount > 0) {
      toast.warning(`Failed to geocode ${errorCount} events`);
    }

  } catch (error) {
    console.error('Error in geocodeAllEvents:', error);
    toast.error('Failed to geocode events');
  }
};
