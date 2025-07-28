import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation, MapPin, Car, Bus, Bike, Footprints } from 'lucide-react';
import { UnifiedItem } from '@/types/unifiedItem';

interface DirectionsModalProps {
  item: UnifiedItem;
  onGetDirections: (startLocation: string, transportMode: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DirectionsModal = ({ item, onGetDirections, open, onOpenChange }: DirectionsModalProps) => {
  const [startLocation, setStartLocation] = useState('');
  const [transportMode, setTransportMode] = useState('driving');
  const isOpen = open !== undefined ? open : false;

  const handleGetDirections = () => {
    if (!startLocation.trim()) return;
    
    onGetDirections(startLocation, transportMode);
    if (onOpenChange) onOpenChange(false);
    setStartLocation('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const transportModes = [
    { value: 'driving', label: 'Driving', icon: Car },
    { value: 'walking', label: 'Walking', icon: Footprints },
    { value: 'cycling', label: 'Cycling', icon: Bike },
    { value: 'transit', label: 'Public Transit', icon: Bus }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {open === undefined && (
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs gap-1"
          >
            <Navigation className="h-3 w-3" />
            Get Directions
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Directions to {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Destination:</span>
            <span>{item.address || item.location}</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startLocation">Starting Location</Label>
            <Input
              id="startLocation"
              placeholder="Enter your starting address..."
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetDirections()}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transportMode">Transportation Mode</Label>
            <Select value={transportMode} onValueChange={setTransportMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transportModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {mode.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGetDirections}
              disabled={!startLocation.trim()}
              className="flex-1"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};