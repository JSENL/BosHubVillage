import { useState } from 'react';
import { UnifiedItem } from '@/types/unifiedItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, MapPin, Calendar, Clock, DollarSign, Building, Tag, ChevronUp, ChevronDown } from 'lucide-react';

interface MapItemSidebarProps {
  selectedItem: UnifiedItem | null;
  onClose: () => void;
}

export const MapItemSidebar = ({ selectedItem, onClose }: MapItemSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (!selectedItem) return null;

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
      {/* Desktop Sidebar - Right side */}
      <div className="hidden lg:block absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getTypeColor(selectedItem.type)}>
                    {selectedItem.type.replace('-', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{selectedItem.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {selectedItem.description && (
              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {selectedItem.category && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Category:</span>
                  <span className="text-gray-600">{selectedItem.category}</span>
                </div>
              )}

              {(selectedItem.address || selectedItem.location) && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Location:</span>
                    <div className="text-gray-600">
                      {selectedItem.address || selectedItem.location}
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-600">
                    {new Date(selectedItem.date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {(selectedItem.start_time || selectedItem.end_time) && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
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
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Price:</span>
                  <span className="text-gray-600">${selectedItem.price}</span>
                </div>
              )}

              {selectedItem.villages && (
                <div className="flex items-start gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500 mt-0.5" />
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
                <div className="flex items-start gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="font-medium">Neighborhoods:</span>
                    <div className="text-gray-600">{selectedItem.neighborhoods}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t">
              <Button onClick={handleViewDetails} className="w-full">
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
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Badge className={getTypeColor(selectedItem.type)} variant="secondary">
              {selectedItem.type.replace('-', ' ')}
            </Badge>
            <div>
              <h3 className="font-semibold text-sm truncate max-w-[200px]">
                {selectedItem.title}
              </h3>
              {(selectedItem.address || selectedItem.location) && (
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  {selectedItem.address || selectedItem.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {selectedItem.description && (
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 text-sm">
                {selectedItem.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Category:</span>
                    <span className="text-gray-600">{selectedItem.category}</span>
                  </div>
                )}

                {selectedItem.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Date:</span>
                    <span className="text-gray-600">
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {(selectedItem.start_time || selectedItem.end_time) && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
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
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Price:</span>
                    <span className="text-gray-600">${selectedItem.price}</span>
                  </div>
                )}
              </div>

              <div className="pt-3">
                <Button onClick={handleViewDetails} className="w-full" size="sm">
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