
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Business } from '@/types/business';
import { useTranslation } from 'react-i18next';

interface EditBusinessDialogProps {
  business: Business;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const EditBusinessDialog = ({ business, open, onOpenChange, onUpdate }: EditBusinessDialogProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: business.title,
    business_type: business.business_type,
    address: business.address,
    neighborhood: business.neighborhood,
    description: business.description,
    short_description: business.short_description || '',
    villages: typeof business.villages === 'string' ? business.villages : 
              Array.isArray(business.villages) ? business.villages.join(', ') : '',
    latitude: business.latitude?.toString() || '',
    longitude: business.longitude?.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        title: formData.title,
        business_type: formData.business_type,
        address: formData.address,
        neighborhood: formData.neighborhood,
        description: formData.description,
        short_description: formData.short_description,
        villages: formData.villages,
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
        .from('business')
        .update(updateData)
        .eq('id', business.id);

      if (error) throw error;

      toast.success('Business updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating business:', error);
      toast.error('Failed to update business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Business Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="business_type">Business Type</Label>
            <Input
              id="business_type"
              value={formData.business_type}
              onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="villages">Villages (comma-separated)</Label>
            <Input
              id="villages"
              value={formData.villages}
              onChange={(e) => setFormData({ ...formData, villages: e.target.value })}
              placeholder="Village 1, Village 2, ..."
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.loading') : t('common.update') + ' ' + t('itemTypes.businesses').slice(0, -1)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
