import React, { useState, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, GripVertical } from 'lucide-react';
import { useGeocoding } from '@/hooks/useGeocoding';
import { toast } from 'sonner';

interface MapSearchBoxProps {
  onLocationFound: (lat: number, lng: number, address: string) => void;
  scale?: number;
}

export const MapSearchBox = ({ onLocationFound, scale = 1 }: MapSearchBoxProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const { geocode, isReady } = useGeocoding();
  const dragRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === dragRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
    <div 
      className="absolute z-10 w-80 origin-top-left transition-transform duration-200"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        transform: `scale(${scale})`
      }}
    >
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg overflow-hidden">
        <div 
          ref={dragRef}
          className="flex items-center px-2 py-1 bg-muted/50 cursor-grab active:cursor-grabbing border-b"
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground ml-2 font-medium">Search Location</span>
        </div>
        <div className="p-3">
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
    </div>
  );
};