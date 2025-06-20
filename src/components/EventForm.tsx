
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useEvents } from '@/hooks/useEvents';
import { useGeocoding } from '@/hooks/useGeocoding';
import BasicEventInfo from '@/components/forms/BasicEventInfo';
import DateTimeFields from '@/components/forms/DateTimeFields';
import LocationFields from '@/components/forms/LocationFields';
import NeighborhoodSelector from '@/components/forms/NeighborhoodSelector';
import PricingFields from '@/components/forms/PricingFields';
import RecurringEventFields from '@/components/forms/RecurringEventFields';
import EventFormButtons from '@/components/forms/EventFormButtons';

interface EventFormProps {
  onClose: () => void;
}

const EventForm = ({ onClose }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    event_type: 'event',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    price: '',
    max_attendees: '',
    is_recurring: false,
    recurring_pattern: '',
    neighborhoods: [] as string[],
  });

  const { createEvent } = useEvents();
  const { geocode, isGeocoding, isReady } = useGeocoding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.date || !formData.location || !formData.start_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isReady) {
      toast.error('Google Maps API not ready. Please try again.');
      return;
    }

    try {
      console.log('Starting geocoding for location:', formData.location);
      const coordinates = await geocode(formData.location);
      
      if (!coordinates) {
        toast.error('Could not find coordinates for the provided address. Please check the location and try again.');
        return;
      }

      console.log('Geocoded coordinates:', coordinates);
      
      await createEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        event_type: formData.event_type,
        date: formData.date,
        start_time: formData.start_time || '00:00',
        end_time: formData.end_time || '23:59',
        location: formData.location,
        price: parseFloat(formData.price) || 0,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        is_recurring: formData.is_recurring,
        recurring_pattern: formData.is_recurring ? formData.recurring_pattern : null,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        neighborhoods: formData.neighborhoods.length > 0 ? formData.neighborhoods.join(',') : null,
      });
      
      onClose();
    } catch (error) {
      // Error handling is done in the useEvents hook
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNeighborhoodToggle = (neighborhood: string) => {
    setFormData(prev => ({
      ...prev,
      neighborhoods: prev.neighborhoods.includes(neighborhood)
        ? prev.neighborhoods.filter(n => n !== neighborhood)
        : [...prev.neighborhoods, neighborhood]
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create New Event
        </CardTitle>
        {!isReady && (
          <p className="text-sm text-amber-600">Loading Google Maps API for address validation...</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicEventInfo 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
          
          <DateTimeFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <LocationFields 
            formData={formData} 
            onInputChange={handleInputChange}
            isGeocoding={isGeocoding}
          />

          <NeighborhoodSelector 
            neighborhoods={formData.neighborhoods}
            onNeighborhoodToggle={handleNeighborhoodToggle}
          />

          <PricingFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <RecurringEventFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <EventFormButtons 
            isGeocoding={isGeocoding}
            isReady={isReady}
            onCancel={onClose}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
