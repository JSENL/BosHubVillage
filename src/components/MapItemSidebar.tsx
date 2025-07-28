import { useState, useRef, useCallback, useEffect } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, MapPin, Calendar, Clock, DollarSign, Building, Tag, ChevronUp, ChevronDown, Move } from 'lucide-react';
import { DirectionsModal } from './map/DirectionsModal';

interface MapItemSidebarProps {
  selectedItem: UnifiedItem | null;
  onClose: () => void;
  onGetDirections?: (startLocation: string, transportMode: string, item: UnifiedItem) => void;
}

export const MapItemSidebar = ({ selectedItem, onClose, onGetDirections }: MapItemSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 16 }); // top-right by default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  
  if (!selectedItem) return null;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof Element && e.target.closest('button, input, select, textarea')) {
      return; // Don't start drag if clicking on interactive elements
    }
    
    setIsDragging(true);
    const rect = sidebarRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sidebarRef.current) return;
    
    const mapContainer = sidebarRef.current.closest('.relative');
    if (!mapContainer) return;
    
    const mapRect = mapContainer.getBoundingClientRect();
    const sidebarRect = sidebarRef.current.getBoundingClientRect();
    
    const newX = Math.max(0, Math.min(
      e.clientX - mapRect.left - dragStart.x,
      mapRect.width - sidebarRect.width
    ));
    const newY = Math.max(0, Math.min(
      e.clientY - mapRect.top - dragStart.y,
      mapRect.height - sidebarRect.height
    ));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'local-service': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = () => {
    const path = selectedItem.type === 'local-service' ? 'local-service' : selectedItem.type;
    window.location.href = `/${path}/${selectedItem.id}`;
  };

  return (
    <>
      {/* Desktop Sidebar - Draggable */}
      <div 
        ref={sidebarRef}
        className={`hidden lg:block absolute w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[calc(100vh-2rem)] overflow-y-auto ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
        style={{ 
          left: position.x, 
          top: position.y,
          userSelect: isDragging ? 'none' : 'auto'
        }}
      >
        <Card className="border-0 shadow-none">
          <CardHeader 
            className="pb-2 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`${getTypeColor(selectedItem.type)} text-xs`}>
                    {selectedItem.type.replace('-', ' ')}
                  </Badge>
                  <Move className="h-3 w-3 text-gray-400" />
                </div>
                <CardTitle className="text-base leading-tight">{selectedItem.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {selectedItem.description && (
              <div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {selectedItem.category && (
                <div className="flex items-center gap-2 text-xs">
                  <Tag className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-600">{selectedItem.category}</span>
                </div>
              )}

              {(selectedItem.address || selectedItem.location) && (
                <div className="flex items-start gap-2 text-xs">
                  <MapPin className="h-3 w-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Location:</span>
                    <div className="text-gray-600">
                      {selectedItem.address || selectedItem.location}
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.date && (
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-600">
                    {new Date(selectedItem.date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {(selectedItem.start_time || selectedItem.end_time) && (
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Time:</span>
                  <span className="text-gray-600">
                    {selectedItem.start_time && selectedItem.end_time 
                      ? `${selectedItem.start_time} - ${selectedItem.end_time}`
                      : selectedItem.start_time || selectedItem.end_time
                    }
                  </span>
                </div>
              )}

              {selectedItem.price && selectedItem.price > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <DollarSign className="h-3 w-3 text-gray-500" />
                  <span className="font-medium">Price:</span>
                  <span className="text-gray-600">${selectedItem.price}</span>
                </div>
              )}

              {selectedItem.villages && (
                <div className="flex items-start gap-2 text-xs">
                  <Building className="h-3 w-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Villages:</span>
                    <div className="text-gray-600">
                      {Array.isArray(selectedItem.villages) 
                        ? selectedItem.villages.join(', ') 
                        : selectedItem.villages
                      }
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.neighborhoods && (
                <div className="flex items-start gap-2 text-xs">
                  <Building className="h-3 w-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Neighborhoods:</span>
                    <div className="text-gray-600">{selectedItem.neighborhoods}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t space-y-2">
              {onGetDirections && selectedItem.latitude && selectedItem.longitude && (
                <DirectionsModal 
                  item={selectedItem}
                  onGetDirections={(start, mode) => onGetDirections(start, mode, selectedItem)}
                />
              )}
              <Button onClick={handleViewDetails} className="w-full text-xs" size="sm">
                View Full Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
        {/* Collapsed Header */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Badge className={`${getTypeColor(selectedItem.type)} text-xs`} variant="secondary">
              {selectedItem.type.replace('-', ' ')}
            </Badge>
            <div>
              <h3 className="font-semibold text-xs truncate max-w-[180px]">
                {selectedItem.title}
              </h3>
              {(selectedItem.address || selectedItem.location) && (
                <p className="text-xs text-gray-500 truncate max-w-[180px]">
                  {selectedItem.address || selectedItem.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="h-6 w-6 p-0"
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

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-3 pb-3 max-h-[50vh] overflow-y-auto">
            <div className="space-y-2">
              {selectedItem.description && (
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-1 text-xs">
                {selectedItem.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{selectedItem.category}</span>
                  </div>
                )}

                {selectedItem.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span className="text-gray-600">
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {(selectedItem.start_time || selectedItem.end_time) && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">Time:</span>
                    <span className="text-gray-600">
                      {selectedItem.start_time && selectedItem.end_time 
                        ? `${selectedItem.start_time} - ${selectedItem.end_time}`
                        : selectedItem.start_time || selectedItem.end_time
                      }
                    </span>
                  </div>
                )}

                {selectedItem.price && selectedItem.price > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">Price:</span>
                    <span className="text-gray-600">${selectedItem.price}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 space-y-2">
                {onGetDirections && selectedItem.latitude && selectedItem.longitude && (
                  <DirectionsModal 
                    item={selectedItem}
                    onGetDirections={(start, mode) => onGetDirections(start, mode, selectedItem)}
                  />
                )}
                <Button onClick={handleViewDetails} className="w-full text-xs" size="sm">
                  View Full Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};