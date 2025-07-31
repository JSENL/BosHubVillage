import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation, MapPin, Car, Bus, Bike, Footprints, ExternalLink } from 'lucide-react';
import { UnifiedItem } from '@/types/unifiedItem';
import { toast } from 'sonner';

interface ExternalDirectionsModalProps {
  item: UnifiedItem;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ExternalDirectionsModal = ({ item, open, onOpenChange }: ExternalDirectionsModalProps) => {
  const [startLocation, setStartLocation] = useState('');
  const [transportMode, setTransportMode] = useState('driving');
  const [selectedApp, setSelectedApp] = useState('google');
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const transportModes = [
    { value: 'driving', label: 'Driving', icon: Car },
    { value: 'walking', label: 'Walking', icon: Footprints },
    { value: 'cycling', label: 'Cycling', icon: Bike },
    { value: 'transit', label: 'Public Transit', icon: Bus }
  ];

  const navigationApps = [
    { 
      value: 'google', 
      label: 'Google Maps', 
      icon: '🗺️',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      value: 'apple', 
      label: 'Apple Maps', 
      icon: '🍎',
      color: 'bg-gray-700 hover:bg-gray-800'
    },
    { 
      value: 'waze', 
      label: 'Waze', 
      icon: '🚗',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const generateDirectionsUrl = () => {
    const destination = item.address || item.location || `${item.latitude},${item.longitude}`;
    const start = startLocation.trim();
    
    // If no start location provided, use current location
    const origin = start || 'Current Location';

    switch (selectedApp) {
      case 'google':
        // Google Maps URLs
        const travelMode = transportMode === 'driving' ? 'driving' : 
                          transportMode === 'walking' ? 'walking' : 
                          transportMode === 'cycling' ? 'bicycling' : 
                          'transit';
        
        if (start) {
          return `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}/@${item.latitude},${item.longitude},15z/data=!3m1!4b1!4m2!4m1!3e${travelMode === 'driving' ? '0' : travelMode === 'walking' ? '2' : travelMode === 'bicycling' ? '1' : '3'}`;
        } else {
          return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
        }

      case 'apple':
        // Apple Maps URLs
        const appleTravelType = transportMode === 'driving' ? 'd' : 
                               transportMode === 'walking' ? 'w' : 
                               transportMode === 'transit' ? 'r' : 'd';
        
        if (start) {
          return `http://maps.apple.com/?saddr=${encodeURIComponent(origin)}&daddr=${encodeURIComponent(destination)}&dirflg=${appleTravelType}`;
        } else {
          return `http://maps.apple.com/?q=${encodeURIComponent(destination)}`;
        }

      case 'waze':
        // Waze URLs (primarily for driving)
        if (item.latitude && item.longitude) {
          return `https://waze.com/ul?ll=${item.latitude}%2C${item.longitude}&navigate=yes`;
        } else {
          return `https://waze.com/ul?q=${encodeURIComponent(destination)}&navigate=yes`;
        }

      default:
        return '';
    }
  };

  const handleOpenDirections = () => {
    try {
      const url = generateDirectionsUrl();
      if (url) {
        // Open in new tab/window
        window.open(url, '_blank', 'noopener,noreferrer');
        
        const appName = navigationApps.find(app => app.value === selectedApp)?.label || 'navigation app';
        toast.success(`Opening directions in ${appName}`);
        
        // Close modal
        handleOpenChange(false);
        setStartLocation('');
      } else {
        toast.error('Could not generate directions URL');
      }
    } catch (error) {
      console.error('Error opening directions:', error);
      toast.error('Failed to open directions');
    }
  };

  const selectedAppInfo = navigationApps.find(app => app.value === selectedApp);

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
            Get Directions to {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Destination:</span>
            <span className="truncate">{item.address || item.location}</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startLocation">Starting Location (Optional)</Label>
            <Input
              id="startLocation"
              placeholder="Enter starting address or leave blank for current location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenDirections()}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use your current location
            </p>
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

          <div className="space-y-2">
            <Label>Choose Navigation App</Label>
            <div className="grid grid-cols-1 gap-2">
              {navigationApps.map((app) => (
                <Button
                  key={app.value}
                  variant={selectedApp === app.value ? "default" : "outline"}
                  className={`w-full justify-start gap-3 h-12 ${
                    selectedApp === app.value ? app.color + ' text-white' : ''
                  }`}
                  onClick={() => setSelectedApp(app.value)}
                >
                  <span className="text-lg">{app.icon}</span>
                  <span className="font-medium">{app.label}</span>
                  {selectedApp === app.value && (
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              ))}
            </div>
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
              onClick={handleOpenDirections}
              className={`flex-1 gap-2 ${selectedAppInfo?.color || 'bg-primary hover:bg-primary/90'} text-white`}
            >
              <ExternalLink className="h-4 w-4" />
              Open in {selectedAppInfo?.label}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};