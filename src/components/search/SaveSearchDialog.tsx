import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bookmark } from 'lucide-react';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useAuth } from '@/hooks/useAuth';

interface SaveSearchDialogProps {
  currentCriteria: {
    searchTerm?: string;
    selectedCategory?: string;
    selectedNeighborhood?: string;
    selectedVillage?: string;
    selectedType?: string;
  };
}

export const SaveSearchDialog = ({ currentCriteria }: SaveSearchDialogProps) => {
  const { user } = useAuth();
  const { saveSearch, isSaving } = useSavedSearches();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);

  if (!user) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    saveSearch(
      {
        name: name.trim(),
        criteria: currentCriteria,
        notifyEmail,
        notifyInApp,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName('');
        },
      }
    );
  };

  const hasFilters =
    currentCriteria.searchTerm ||
    (currentCriteria.selectedCategory && currentCriteria.selectedCategory !== 'all') ||
    (currentCriteria.selectedNeighborhood && currentCriteria.selectedNeighborhood !== 'all') ||
    (currentCriteria.selectedVillage && currentCriteria.selectedVillage !== 'all') ||
    (currentCriteria.selectedType && currentCriteria.selectedType !== 'all');

  if (!hasFilters) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          Save Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save This Search</DialogTitle>
          <DialogDescription>
            Get notified when new content matches your search criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search-name">Search Name</Label>
            <Input
              id="search-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Local Events This Week"
            />
          </div>

          <div className="space-y-3">
            <Label>Notification Preferences</Label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-email" className="font-normal">
                  Email notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive email when new matches are found
                </p>
              </div>
              <Switch
                id="notify-email"
                checked={notifyEmail}
                onCheckedChange={setNotifyEmail}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notify-in-app" className="font-normal">
                  In-app notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications in the app
                </p>
              </div>
              <Switch
                id="notify-in-app"
                checked={notifyInApp}
                onCheckedChange={setNotifyInApp}
              />
            </div>
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="text-sm font-medium mb-2">Current filters:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {currentCriteria.searchTerm && (
                <li>• Search: "{currentCriteria.searchTerm}"</li>
              )}
              {currentCriteria.selectedCategory && currentCriteria.selectedCategory !== 'all' && (
                <li>• Category: {currentCriteria.selectedCategory}</li>
              )}
              {currentCriteria.selectedType && currentCriteria.selectedType !== 'all' && (
                <li>• Type: {currentCriteria.selectedType}</li>
              )}
              {currentCriteria.selectedNeighborhood && currentCriteria.selectedNeighborhood !== 'all' && (
                <li>• Neighborhood: {currentCriteria.selectedNeighborhood}</li>
              )}
              {currentCriteria.selectedVillage && currentCriteria.selectedVillage !== 'all' && (
                <li>• Village: {currentCriteria.selectedVillage}</li>
              )}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving}>
            {isSaving ? 'Saving...' : 'Save Search'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
