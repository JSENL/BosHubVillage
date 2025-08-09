import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useGeocoding } from '@/hooks/useGeocoding';
import { toast } from 'sonner';

interface MapSearchBoxProps {
  onLocationFound: (lat: number, lng: number, address: string) => void;
}

export const MapSearchBox = ({ onLocationFound }: MapSearchBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { geocode, isReady } = useGeocoding();

  const handleSearch = async () => {
    if (!searchQuery.trim() || !isReady) return;

    setIsSearching(true);
    try {
      const result = await geocode(searchQuery);
      
      if (result) {
        onLocationFound(result.latitude, result.longitude, searchQuery);
        toast.success('Location found!');
      } else {
        toast.error('Location not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error searching for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-80">
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for an address or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-8"
              disabled={!isReady}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching || !isReady}
            size="sm"
            className="shrink-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {!isReady && (
          <p className="text-xs text-muted-foreground mt-2">
            Loading search functionality...
          </p>
        )}
      </div>
    </div>
  );
};