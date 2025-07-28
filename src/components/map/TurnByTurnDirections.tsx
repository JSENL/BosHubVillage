import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';

interface TurnByTurnDirectionsProps {
  directions: any[];
  route: any;
  isVisible: boolean;
  onClose: () => void;
}

export const TurnByTurnDirections = ({ directions, route, isVisible, onClose }: TurnByTurnDirectionsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isVisible || !directions || directions.length === 0) {
    return null;
  }

  const totalDuration = route ? Math.round(route.duration / 60) : 0;
  const totalDistance = route ? (route.distance / 1000).toFixed(1) : 0;

  return (
    <div className="absolute bottom-4 left-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[calc(100vh-8rem)] overflow-hidden">
      <Card className="border-0 shadow-none">
        <CardHeader 
          className="pb-2 px-3 py-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm">Turn-by-Turn Directions</CardTitle>
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
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              )}
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