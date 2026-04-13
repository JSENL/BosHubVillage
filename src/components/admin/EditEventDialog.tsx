
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Event, type EventContactType } from '@/hooks/useEvents';
import { useTranslation } from 'react-i18next';
import { AdminContentCoverImageSection } from '@/components/admin/AdminContentCoverImageSection';

interface EditEventDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const EditEventDialog = ({ event, open, onOpenChange, onUpdate }: EditEventDialogProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    event.image_url ?? null
  );
  
  // Helper function to format date properly without timezone issues
  const formatDateForInput = (dateString: string) => {
    // Ensure we're working with just the date part, no time conversion
    const date = new Date(dateString + 'T00:00:00');
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    category: event.category,
    location: event.location,
    address: event.address || '',
    date: formatDateForInput(event.date),
    start_time: event.start_time || '',
    end_time: event.end_time || '',
    price: event.price || 0,
    max_attendees: event.max_attendees || null,
    latitude: event.latitude?.toString() || '',
    longitude: event.longitude?.toString() || '',
    is_sponsored: event.is_sponsored || false,
    contact_type: (event.contact_type || '') as EventContactType | '',
    contact_value: event.contact_value || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: event.title,
        description: event.description || '',
        category: event.category,
        location: event.location,
        address: event.address || '',
        date: formatDateForInput(event.date),
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        price: event.price || 0,
        max_attendees: event.max_attendees || null,
        latitude: event.latitude?.toString() || '',
        longitude: event.longitude?.toString() || '',
        is_sponsored: event.is_sponsored || false,
        contact_type: (event.contact_type || '') as EventContactType | '',
        contact_value: event.contact_value || '',
      });
    }
  }, [open, event.id, event.title, event.description, event.category, event.location, event.address, event.date, event.start_time, event.end_time, event.price, event.max_attendees, event.latitude, event.longitude, event.is_sponsored, event.contact_type, event.contact_value]);

  useEffect(() => {
    if (open) {
      setCoverImageUrl(event.image_url ?? null);
    }
  }, [open, event.id, event.image_url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        address: formData.address,
        date: formData.date,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        price: formData.price,
        max_attendees: formData.max_attendees,
        is_sponsored: formData.is_sponsored,
        contact_type: formData.contact_type || null,
        contact_value: formData.contact_type ? (formData.contact_value?.trim() || null) : null,
        image_url: coverImageUrl || null,
      };

      // Handle coordinates - only include if they have values
      if (formData.latitude && formData.longitude) {
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            updateData.latitude = lat;
            updateData.longitude = lng;
          } else {
            toast.error('Invalid coordinate ranges. Latitude must be between -90 and 90, longitude between -180 and 180.');
            setLoading(false);
            return;
          }
        } else {
          toast.error('Invalid coordinate format. Please enter valid numbers.');
          setLoading(false);
          return;
        }
      } else if (formData.latitude || formData.longitude) {
        toast.error('Please provide both latitude and longitude, or leave both empty.');
        setLoading(false);
        return;
      }

      // Update the event with an explicit updated_at timestamp
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', event.id);

      if (error) throw error;

      // Log the successful update for debugging
      console.log('Event updated successfully:', {
        eventId: event.id,
        updatedFields: Object.keys(updateData),
        updateData
      });

      toast.success('Event updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Community, Sports, Arts, Education..."
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full street address (optional)"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="max_attendees">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                min="1"
                value={formData.max_attendees || ''}
                onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="No limit"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., 42.3601"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., -71.0589"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_sponsored"
              type="checkbox"
              checked={formData.is_sponsored}
              onChange={(e) => setFormData({ ...formData, is_sponsored: e.target.checked })}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <Label htmlFor="is_sponsored" className="text-sm font-medium">
              🌟 Sponsored/Special Event (will have glowing marker)
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Contact</Label>
            <p className="text-xs text-muted-foreground mb-2">
              How attendees can contact about this event: message through our system, phone, email, or website.
            </p>
            <Select
              value={formData.contact_type || 'none'}
              onValueChange={(v) => setFormData({ ...formData, contact_type: (v === 'none' ? '' : v) as EventContactType | '', contact_value: v === 'message' ? '' : formData.contact_value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="No contact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No contact</SelectItem>
                <SelectItem value="message">Message through our system</SelectItem>
                <SelectItem value="phone">Phone number</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>
            {formData.contact_type && formData.contact_type !== 'message' && (
              <Input
                value={formData.contact_value}
                onChange={(e) => setFormData({ ...formData, contact_value: e.target.value })}
                placeholder={
                  formData.contact_type === 'phone'
                    ? 'e.g. (617) 555-0123'
                    : formData.contact_type === 'email'
                    ? 'e.g. organizer@example.com'
                    : 'e.g. https://example.com/event'
                }
              />
            )}
          </div>

          <AdminContentCoverImageSection
            table="events"
            recordId={event.id}
            imageUrl={coverImageUrl}
            onImageUrlChange={setCoverImageUrl}
            onPersisted={onUpdate}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.loading') : t('common.update') + ' ' + t('itemTypes.events').slice(0, -1)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
