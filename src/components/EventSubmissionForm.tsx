
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, DollarSign, Users, Repeat, Send, Loader2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useEventSubmissions } from '@/hooks/useEventSubmissions';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useEventCategories } from '@/hooks/useCategories';
import { EventPdfUpload } from '@/components/forms/EventPdfUpload';

interface EventSubmissionFormProps {
  onClose?: () => void;
}

const EventSubmissionForm = ({ onClose }: EventSubmissionFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    event_type: 'event',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    website_link: '',
    price: '',
    max_attendees: '',
    is_recurring: false,
    recurring_pattern: '',
    registration_required: false,
    neighborhoods: [] as string[],
    villages: '',
  });

  const { submitEvent } = useEventSubmissions();
  const { geocode, isGeocoding, isReady } = useGeocoding();
  const { data: eventCategories = [] } = useEventCategories();

  // Event categories now come from the database

  const eventTypes = [
    { value: 'event', label: 'Event' },
    { value: 'business', label: 'Business' },
    { value: 'news', label: 'News' },
  ];

  const neighborhoods = [
    { value: 'beacon-hill', label: 'Beacon Hill' },
    { value: 'back-bay', label: 'Back Bay' },
    { value: 'north-end', label: 'North End' },
    { value: 'south-end', label: 'South End' },
    { value: 'chinatown', label: 'Chinatown' },
    { value: 'financial-district', label: 'Financial District' },
    { value: 'fenway', label: 'Fenway' },
    { value: 'cambridge', label: 'Cambridge' },
    { value: 'somerville', label: 'Somerville' },
    { value: 'charlestown', label: 'Charlestown' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.date || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isReady) {
      toast.error('Mapbox API not ready. Please try again.');
      return;
    }

    try {
      // Geocode the location to get coordinates
      console.log('Starting geocoding for submission location:', formData.location);
      const coordinates = await geocode(formData.location);
      
      // Note: For submissions, we'll still allow submission even if geocoding fails
      // The admin can review and fix the location later
      if (!coordinates) {
        console.warn('Geocoding failed for submission, proceeding without coordinates');
        toast.warning('Could not find exact coordinates for the address, but your submission will be reviewed by our team.');
      }

      await submitEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        event_type: formData.event_type,
        date: formData.date,
        start_time: formData.start_time || '00:00',
        end_time: formData.end_time || '00:00',
        location: formData.location,
        website_link: formData.website_link || null,
        price: parseFloat(formData.price) || 0,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null,
        is_recurring: formData.is_recurring,
        recurring_pattern: formData.is_recurring ? formData.recurring_pattern : null,
        registration_required: formData.registration_required,
        neighborhoods: formData.neighborhoods.length > 0 ? formData.neighborhoods : null,
        villages: formData.villages || null,
        latitude: coordinates?.latitude || null,
        longitude: coordinates?.longitude || null,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        event_type: 'event',
        date: '',
        start_time: '',
        end_time: '',
        location: '',
        website_link: '',
        price: '',
        max_attendees: '',
        is_recurring: false,
        recurring_pattern: '',
        registration_required: false,
        neighborhoods: [],
        villages: '',
      });
      
      if (onClose) onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventDataExtracted = (eventData: any) => {
    setFormData(prev => ({
      ...prev,
      ...eventData,
      // Convert price to string for the form
      price: eventData.price ? eventData.price.toString() : '',
      // Convert maxAttendees to string for the form
      max_attendees: eventData.maxAttendees ? eventData.maxAttendees.toString() : '',
      // Map website to website_link
      website_link: eventData.website || '',
      // Map startTime to start_time and endTime to end_time
      start_time: eventData.startTime || '',
      end_time: eventData.endTime || '',
      // Map registrationRequired to registration_required
      registration_required: eventData.registrationRequired || false,
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-caribbean-teal to-grass-green bg-clip-text text-transparent flex items-center">
          <Send className="h-6 w-6 mr-2 text-caribbean-teal" />
          Submit Event for Approval
        </CardTitle>
        <p className="text-gray-600">Your event will be reviewed by our admin team before being published.</p>
        {!isReady && (
          <p className="text-sm text-amber-600">Loading Mapbox API for address validation...</p>
        )}
      </CardHeader>
      <CardContent>
        {/* PDF Upload Component */}
        <EventPdfUpload onEventDataExtracted={handleEventDataExtracted} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Event Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your event"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="event_type" className="text-sm font-medium text-gray-700">
                  Event Type *
                </Label>
                <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
                  <SelectTrigger className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="neighborhoods" className="text-sm font-medium text-gray-700">
                  Neighborhoods
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Neighborhoods in the Boston area are the big areas such as Roxbury, Dorchester, South End, Hyde Park or Mattapan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="neighborhoods"
                placeholder="Enter neighborhoods separated by commas (e.g., Back Bay, Cambridge, South End)"
                value={formData.neighborhoods.join(', ')}
                onChange={(e) => {
                  const neighborhoods = e.target.value.split(',').map(n => n.trim()).filter(n => n.length > 0);
                  handleInputChange('neighborhoods', neighborhoods);
                }}
                className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter multiple neighborhoods separated by commas
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="villages" className="text-sm font-medium text-gray-700">
                  Villages
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                      <Info className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>These are the subneighborhoods of Boston: Fields Corner, Ashmont, Fort Hill, or Grove Hall</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="villages"
                placeholder="Enter villages (e.g., Beacon Hill Village, Cambridge Village, etc.)"
                value={formData.villages}
                onChange={(e) => handleInputChange('villages', e.target.value)}
                className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter villages where this event is relevant
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time" className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Start Time
                </Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
                />
              </div>

              <div>
                <Label htmlFor="end_time" className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  End Time
                </Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location *
              {isGeocoding && <Loader2 className="h-3 w-3 ml-2 animate-spin" />}
            </Label>
            <Input
              id="location"
              placeholder="Enter full address (e.g., 123 Main St, Boston, MA)"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
              disabled={isGeocoding}
            />
            <p className="text-xs text-gray-500 mt-1">
              Address will be automatically converted to map coordinates
            </p>
          </div>

          {/* Website Link */}
          <div>
            <Label htmlFor="website_link" className="text-sm font-medium text-gray-700">
              Website Link (Optional)
            </Label>
            <Input
              id="website_link"
              type="url"
              placeholder="https://example.com"
              value={formData.website_link}
              onChange={(e) => handleInputChange('website_link', e.target.value)}
              className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
            />
            <p className="text-xs text-gray-500 mt-1">
              Add a website link for more information about this event
            </p>
          </div>

          {/* Price and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Ticket Price
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
              />
            </div>

            <div>
              <Label htmlFor="maxAttendees" className="text-sm font-medium text-gray-700 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Max Attendees
              </Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Unlimited"
                value={formData.max_attendees}
                onChange={(e) => handleInputChange('max_attendees', e.target.value)}
                className="mt-1 border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal"
              />
            </div>
          </div>

          {/* Recurring Event */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => handleInputChange('is_recurring', checked)}
              />
              <Label htmlFor="recurring" className="flex items-center text-sm font-medium text-gray-700">
                <Repeat className="h-4 w-4 mr-1" />
                Recurring Event
              </Label>
            </div>

            {formData.is_recurring && (
              <Select value={formData.recurring_pattern} onValueChange={(value) => handleInputChange('recurring_pattern', value)}>
                <SelectTrigger className="border-caribbean-teal/30 focus:border-caribbean-teal focus:ring-caribbean-teal">
                  <SelectValue placeholder="Select recurring pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Registration Required */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="registration"
                checked={formData.registration_required}
                onCheckedChange={(checked) => handleInputChange('registration_required', checked)}
              />
              <Label htmlFor="registration" className="flex items-center text-sm font-medium text-gray-700">
                <Users className="h-4 w-4 mr-1" />
                Registration Required
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              If enabled, users will need to register for this event and admin approval will be required.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isGeocoding || !isReady}
              variant="orange"
              className="w-full"
            >
              {isGeocoding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Approval
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventSubmissionForm;
