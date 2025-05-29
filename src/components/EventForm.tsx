
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Clock, DollarSign, Users, Repeat } from 'lucide-react';
import { toast } from 'sonner';

interface EventFormProps {
  onClose: () => void;
}

const EventForm = ({ onClose }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    price: '',
    maxAttendees: '',
    isRecurring: false,
    recurringPattern: '',
  });

  const categories = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'food', label: 'Food & Drink' },
    { value: 'art', label: 'Arts & Culture' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'family', label: 'Family' },
    { value: 'health', label: 'Health & Wellness' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.category || !formData.date || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically save to a database
    console.log('Event data:', formData);
    toast.success('Event created successfully!');
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create New Event
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
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
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category *
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location *
            </Label>
            <Input
              id="location"
              placeholder="Enter event location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
            />
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
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
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
                value={formData.maxAttendees}
                onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Recurring Event */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
              />
              <Label htmlFor="recurring" className="flex items-center text-sm font-medium text-gray-700">
                <Repeat className="h-4 w-4 mr-1" />
                Recurring Event
              </Label>
            </div>

            {formData.isRecurring && (
              <Select value={formData.recurringPattern} onValueChange={(value) => handleInputChange('recurringPattern', value)}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
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

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Create Event
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
