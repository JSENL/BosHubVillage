import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Building } from 'lucide-react';

interface ChangeBusinessOwnerDialogProps {
  business: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const ChangeBusinessOwnerDialog = ({
  business,
  open,
  onOpenChange,
  onUpdate
}: ChangeBusinessOwnerDialogProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch all users/profiles
  const { data: users } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: open
  });

  const currentOwner = business.business_owner?.[0];

  const handleChangeOwner = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    setLoading(true);
    try {
      // First, delete existing business_owner record if it exists
      if (currentOwner) {
        const { error: deleteError } = await supabase
          .from('business_owner')
          .delete()
          .eq('business_id', business.id);

        if (deleteError) throw deleteError;
      }

      // Then create new business_owner record
      const { error: insertError } = await supabase
        .from('business_owner')
        .insert({
          business_id: business.id,
          owner_id: selectedUserId
        });

      if (insertError) throw insertError;

      toast.success('Business owner updated successfully');
      onUpdate();
      onOpenChange(false);
      setSelectedUserId('');
    } catch (error: any) {
      console.error('Error updating business owner:', error);
      toast.error('Failed to update business owner');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOwner = async () => {
    if (!currentOwner) return;

    if (!confirm('Are you sure you want to remove the current business owner?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('business_owner')
        .delete()
        .eq('business_id', business.id);

      if (error) throw error;

      toast.success('Business owner removed successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error removing business owner:', error);
      toast.error('Failed to remove business owner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Change Business Owner
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Business</Label>
            <p className="text-sm text-gray-600">{business.title}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Current Owner</Label>
            {currentOwner ? (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded mt-1">
                <User className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">{currentOwner.profiles?.full_name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{currentOwner.profiles?.email || 'No email'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-1">No owner assigned</p>
            )}
          </div>

          <div>
            <Label htmlFor="user-select" className="text-sm font-medium">
              New Owner
            </Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex flex-col">
                      <span>{user.full_name || 'Unnamed User'}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleChangeOwner}
              disabled={loading || !selectedUserId}
              className="flex-1"
            >
              {loading ? 'Updating...' : 'Change Owner'}
            </Button>
            
            {currentOwner && (
              <Button
                onClick={handleRemoveOwner}
                disabled={loading}
                variant="destructive"
                className="flex-1"
              >
                {loading ? 'Removing...' : 'Remove Owner'}
              </Button>
            )}
            
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};