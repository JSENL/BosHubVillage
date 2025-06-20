
import { useMemo } from 'react';
import { Event } from '@/hooks/useEvents';
import { allSampleEvents } from '@/utils/sampleEvents';

export const useSampleEvents = () => {
  const transformedSampleEvents: Event[] = useMemo(() => {
    return allSampleEvents.map((sampleEvent, index) => ({
      id: `sample-${index}`,
      title: sampleEvent.title,
      description: sampleEvent.description,
      category: sampleEvent.category,
      event_type: 'event', // Default to 'event' for sample events
      date: sampleEvent.date,
      start_time: sampleEvent.time, // Use time as start_time
      end_time: '', // No end time for sample events
      location: sampleEvent.location,
      price: sampleEvent.price,
      max_attendees: sampleEvent.max_attendees,
      is_recurring: sampleEvent.is_recurring,
      recurring_pattern: sampleEvent.recurring_pattern,
      created_by: 'sample-user',
      latitude: sampleEvent.latitude,
      longitude: sampleEvent.longitude,
      neighborhoods: 'downtown,back-bay', // Convert array to string format
      attendees_count: 0
    }));
  }, []);

  return { transformedSampleEvents };
};
