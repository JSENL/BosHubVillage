
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Building, FileText } from 'lucide-react';

interface BasicEventInfoProps {
  formData: {
    title: string;
    description: string;
    category: string;
    event_type: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicEventInfo = ({ formData, onInputChange }: BasicEventInfoProps) => {
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

  const eventTypes = [
    { value: 'event', label: 'Event', icon: CalendarIcon },
    { value: 'business', label: 'Business', icon: Building },
    { value: 'news', label: 'Culture', icon: FileText },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          Event Title *
        </Label>
        <Input
          id="title"
          placeholder="Enter event title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
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
          onChange={(e) => onInputChange('description', e.target.value)}
          className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            Category *
          </Label>
          <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
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

        <div>
          <Label htmlFor="event_type" className="text-sm font-medium text-gray-700">
            Type *
          </Label>
          <Select value={formData.event_type} onValueChange={(value) => onInputChange('event_type', value)}>
            <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-400 focus:ring-purple-400">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {type.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicEventInfo;
