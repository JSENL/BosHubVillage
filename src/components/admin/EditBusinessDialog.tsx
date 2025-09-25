
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Business } from '@/types/business';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

interface EditBusinessDialogProps {
  business: any; // Extended Business with owner info
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const EditBusinessDialog = ({ business, open, onOpenChange, onUpdate }: EditBusinessDialogProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
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

  // Fetch all users for owner assignment
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name');
      
      if (error) throw error;
      return data;
    },
    enabled: open
  });

  // Set current owner when dialog opens
  useEffect(() => {
    if (business?.business_owner && business.business_owner.length > 0) {
      setSelectedUserId(business.business_owner[0].owner_id);
    } else {
      setSelectedUserId('');
    }
  }, [business]);

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

  const handleChangeOwner = async () => {
    setOwnerLoading(true);
    try {
      // First, remove any existing business owner
      const { error: deleteError } = await supabase
        .from('business_owner')
        .delete()
        .eq('business_id', business.id);

      if (deleteError) throw deleteError;

      // If a user is selected, assign them as the new owner
      if (selectedUserId) {
        const { error: insertError } = await supabase
          .from('business_owner')
          .insert({
            business_id: business.id,
            owner_id: selectedUserId
          });

        if (insertError) throw insertError;
        toast.success('Business owner updated successfully');
      } else {
        toast.success('Business owner removed successfully');
      }

      onUpdate();
    } catch (error: any) {
      console.error('Error updating business owner:', error);
      toast.error('Failed to update business owner');
    } finally {
      setOwnerLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Business Details</TabsTrigger>
            <TabsTrigger value="owner">Business Owner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
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
          </TabsContent>
          
          <TabsContent value="owner" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Business Owner</h3>
                {business?.business_owner && business.business_owner.length > 0 ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium">
                      {business.business_owner[0].profiles?.full_name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {business.business_owner[0].profiles?.email || 'No email'}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                    No owner assigned
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="newOwner">Assign Owner</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner assignment..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No owner assigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name || user.email} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleChangeOwner}
                  disabled={ownerLoading}
                >
                  {ownerLoading ? 'Updating...' : selectedUserId ? 'Assign Owner' : 'Remove Owner'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
