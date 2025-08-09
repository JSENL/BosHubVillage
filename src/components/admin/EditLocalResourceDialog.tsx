
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LocalResource } from '@/types/localServices';
import { useQueryClient } from '@tanstack/react-query';

interface EditLocalResourceDialogProps {
  localResource: LocalResource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const EditLocalResourceDialog = ({ localResource, open, onOpenChange, onUpdate }: EditLocalResourceDialogProps) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: localResource.name,
    category: localResource.category,
    address: localResource.address,
    neighborhood: localResource.neighborhood,
    village: localResource.village || '',
    description: localResource.description || '',
    website_link: localResource.website_link || '',
    latitude: localResource.latitude?.toString() || '',
    longitude: localResource.longitude?.toString() || '',
    permanently_closed: localResource.permanently_closed || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        category: formData.category,
        address: formData.address,
        neighborhood: formData.neighborhood,
        village: formData.village || null,
        description: formData.description,
        website_link: formData.website_link || null,
        permanently_closed: formData.permanently_closed,
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

      const { error } = await supabase
        .from('local_resources')
        .update(updateData)
        .eq('id', localResource.id);

      if (error) throw error;

      // Invalidate the local resources query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['local-resources'] });
      
      toast.success('Local resource updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating local resource:', error);
      toast.error('Failed to update local resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Local Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="village">Village</Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website_link">Website Link</Label>
            <Input
              id="website_link"
              type="url"
              value={formData.website_link}
              onChange={(e) => setFormData({ ...formData, website_link: e.target.value })}
              placeholder="https://example.com"
            />
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
            <Checkbox
              id="permanently_closed"
              checked={formData.permanently_closed}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, permanently_closed: checked as boolean })
              }
            />
            <Label htmlFor="permanently_closed" className="text-sm font-medium">
              Permanently Closed
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Local Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
