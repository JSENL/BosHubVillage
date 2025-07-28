import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation, ChevronUp, ChevronDown, X, Move, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

interface TurnByTurnDirectionsProps {
  directions: any[];
  route: any;
  isVisible: boolean;
  onClose: () => void;
}

export const TurnByTurnDirections = ({ directions, route, isVisible, onClose }: TurnByTurnDirectionsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < directions.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollToStep(currentStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToStep(currentStep - 1);
    }
  };

  const scrollToStep = (stepIndex: number) => {
    const stepElement = scrollContainerRef.current?.querySelector(`[data-step="${stepIndex}"]`);
    if (stepElement) {
      stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Reset current step when directions change
  useEffect(() => {
    setCurrentStep(0);
  }, [directions]);

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
          
          {/* Route Summary and Navigation */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {totalDistance} km
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {totalDuration} min
              </Badge>
            </div>
            
            {/* Step Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-xs text-gray-500 min-w-[3rem] text-center">
                {currentStep + 1}/{directions.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextStep}
                disabled={currentStep === directions.length - 1}
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="px-3 py-2">
            <div 
              ref={scrollContainerRef}
              className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {directions.map((step, index) => (
                <div 
                  key={index} 
                  data-step={index}
                  className={`flex gap-2 p-2 rounded-md border transition-all cursor-pointer ${
                    index === currentStep 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setCurrentStep(index);
                    scrollToStep(index);
                  }}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-400 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${
                      index === currentStep ? 'text-blue-800 font-medium' : 'text-gray-800'
                    }`}>
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