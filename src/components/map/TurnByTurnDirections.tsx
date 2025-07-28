import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation, ChevronUp, ChevronDown, X, Move } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

interface TurnByTurnDirectionsProps {
  directions: any[];
  route: any;
  isVisible: boolean;
  onClose: () => void;
}

export const TurnByTurnDirections = ({ directions, route, isVisible, onClose }: TurnByTurnDirectionsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 16 }); // bottom-left by default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isVisible || (e.target instanceof Element && e.target.closest('button, input, select, textarea'))) {
      return; // Don't start drag if clicking on interactive elements
    }
    
    setIsDragging(true);
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [isVisible]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !panelRef.current || !isVisible) return;
    
    const mapContainer = panelRef.current.closest('.relative');
    if (!mapContainer) return;
    
    const mapRect = mapContainer.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    
    const newX = Math.max(0, Math.min(
      e.clientX - mapRect.left - dragStart.x,
      mapRect.width - panelRect.width
    ));
    const newY = Math.max(0, Math.min(
      e.clientY - mapRect.top - dragStart.y,
      mapRect.height - panelRect.height
    ));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart, isVisible]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging && isVisible) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, isVisible]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!isVisible || !directions || directions.length === 0) {
    return null;
  }

  const totalDuration = route ? Math.round(route.duration / 60) : 0;
  const totalDistance = route ? (route.distance / 1000).toFixed(1) : 0;

  return (
    <div 
      ref={panelRef}
      className={`absolute w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[calc(100vh-8rem)] overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
      style={{ 
        left: position.x, 
        top: position.y,
        userSelect: isDragging ? 'none' : 'auto'
      }}
    >
      <Card className="border-0 shadow-none">
        <CardHeader 
          className="pb-2 px-3 py-2 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm">Turn-by-Turn Directions</CardTitle>
              <Move className="h-3 w-3 text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="h-5 w-5 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-5 w-5 p-0 hover:bg-gray-100"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Route Summary */}
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {totalDistance} km
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {totalDuration} min
            </Badge>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="px-3 py-2 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {directions.map((step, index) => (
                <div key={index} className="flex gap-2 p-2 rounded-md bg-gray-50 border">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {step.maneuver?.instruction || 'Continue straight'}
                    </p>
                    {step.distance && (
                      <p className="text-xs text-gray-500 mt-1">
                        {step.distance > 1000 
                          ? `${(step.distance / 1000).toFixed(1)} km`
                          : `${Math.round(step.distance)} m`
                        }
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};