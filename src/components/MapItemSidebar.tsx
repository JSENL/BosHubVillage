import { useState, useRef, useCallback, useEffect } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, MapPin, Calendar, Clock, DollarSign, Building, Tag, ChevronUp, ChevronDown, Move } from 'lucide-react';
import { DirectionsModal } from './map/DirectionsModal';
import { useNavigate } from 'react-router-dom';

interface MapItemSidebarProps {
  selectedItem: UnifiedItem | null;
  onClose: () => void;
  onGetDirections?: (startLocation: string, transportMode: string, item: UnifiedItem) => void;
}

export const MapItemSidebar = ({ selectedItem, onClose, onGetDirections }: MapItemSidebarProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!selectedItem || (e.target instanceof Element && e.target.closest('button, input, select, textarea'))) {
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
  }, [selectedItem]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sidebarRef.current || !selectedItem) return;
    
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
  }, [isDragging, dragStart, selectedItem]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging && selectedItem) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, selectedItem]);

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
    if (!selectedItem) return;
    const path = selectedItem.type === 'local-service' ? 'local-resource' : selectedItem.type;
    navigate(`/${path}/${selectedItem.id}`);
  };

  // Don't render anything if no item is selected
  if (!selectedItem) {
    return null;
  }

  

  return (
    <>
      {/* Desktop Sidebar - Compact & Draggable */}
      <div 
        ref={sidebarRef}
        className={`hidden md:block absolute w-64 lg:w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[calc(100vh-8rem)] overflow-y-auto ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
        style={{ 
          left: position.x, 
          top: position.y,
          userSelect: isDragging ? 'none' : 'auto',
          maxWidth: 'calc(100vw - 2rem)'
        }}
      >
        <Card className="border-0 shadow-none">
          <CardHeader 
            className="pb-1 px-3 py-2 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <Badge className={`${getTypeColor(selectedItem.type)} text-xs px-1 py-0`}>
                    {selectedItem.type.replace('-', ' ')}
                  </Badge>
                  <Move className="h-3 w-3 text-gray-400 flex-shrink-0" />
                </div>
                <CardTitle className="text-sm leading-tight truncate pr-2">{selectedItem.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-5 w-5 p-0 hover:bg-gray-100 flex-shrink-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-2 px-3 py-2">
            {selectedItem.description && (
              <div>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {selectedItem.description}
                </p>
              </div>
            )}

            <div className="space-y-1">{/* Reduced spacing */}
              {selectedItem.category && (
                <div className="flex items-center gap-1 text-xs">
                  <Tag className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-600 truncate">{selectedItem.category}</span>
                </div>
              )}

              {(selectedItem.address || selectedItem.location) && (
                <div className="flex items-start gap-1 text-xs">
                  <MapPin className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">Location:</span>
                    <div className="text-gray-600 break-words">
                      {selectedItem.address || selectedItem.location}
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.date && (
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-600 truncate">
                    {new Date(selectedItem.date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {(selectedItem.start_time || selectedItem.end_time) && (
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Time:</span>
                  <span className="text-gray-600 truncate">
                    {selectedItem.start_time && selectedItem.end_time 
                      ? `${selectedItem.start_time} - ${selectedItem.end_time}`
                      : selectedItem.start_time || selectedItem.end_time
                    }
                  </span>
                </div>
              )}

              {selectedItem.price && selectedItem.price > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <DollarSign className="h-3 w-3 text-gray-500 flex-shrink-0" />
                  <span className="font-medium">Price:</span>
                  <span className="text-gray-600">${selectedItem.price}</span>
                </div>
              )}

              {selectedItem.villages && (
                <div className="flex items-start gap-1 text-xs">
                  <Building className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">Villages:</span>
                    <div className="text-gray-600 break-words">
                      {Array.isArray(selectedItem.villages) 
                        ? selectedItem.villages.join(', ') 
                        : selectedItem.villages
                      }
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.neighborhoods && (
                <div className="flex items-start gap-1 text-xs">
                  <Building className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">Neighborhoods:</span>
                    <div className="text-gray-600 break-words">{selectedItem.neighborhoods}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-1 border-t space-y-1">{/* Reduced spacing and padding */}
              {onGetDirections && selectedItem.latitude && selectedItem.longitude && (
                <DirectionsModal 
                  item={selectedItem}
                  onGetDirections={(start, mode) => onGetDirections(start, mode, selectedItem)}
                />
              )}
              <Button onClick={handleViewDetails} className="w-full text-xs h-7" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Sheet - Responsive */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg max-h-[70vh] overflow-hidden">
        {/* Collapsed Header */}
        <div 
          className="flex items-center justify-between p-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Badge className={`${getTypeColor(selectedItem.type)} text-xs flex-shrink-0`} variant="secondary">
              {selectedItem.type.replace('-', ' ')}
            </Badge>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm truncate">
                {selectedItem.title}
              </h3>
              {(selectedItem.address || selectedItem.location) && (
                <p className="text-xs text-gray-500 truncate">
                  {selectedItem.address || selectedItem.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
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
          <div className="px-2 pb-2 max-h-[50vh] overflow-y-auto">{/* Reduced padding */}
            <div className="space-y-1">
              {selectedItem.description && (
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-1 text-xs">{/* Reduced spacing */}
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

              <div className="pt-1 space-y-1">{/* Reduced spacing */}
                {onGetDirections && selectedItem.latitude && selectedItem.longitude && (
                  <DirectionsModal 
                    item={selectedItem}
                    onGetDirections={(start, mode) => onGetDirections(start, mode, selectedItem)}
                  />
                )}
                <Button onClick={handleViewDetails} className="w-full text-xs h-7" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};