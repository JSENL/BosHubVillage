import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapLegendProps {
  scale?: number;
}

export const MapLegend = ({ scale = 1 }: MapLegendProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const legendItems = [
    { letter: 'E', label: 'Event', color: 'hsl(0, 70%, 55%)' },
    { letter: 'B', label: 'Business', color: 'hsl(220, 90%, 56%)' },
    { letter: 'L', label: 'Local Resource', color: 'hsl(16, 85%, 60%)' }
  ];

  return (
    <Card 
      className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm border shadow-lg origin-bottom-left transition-all duration-200"
      style={{ transform: `scale(${scale})` }}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          {isExpanded && <h4 className="text-sm font-semibold text-gray-800">Map Legend</h4>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 ml-auto"
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <div className={isExpanded ? "space-y-1" : "flex gap-1"}>
          {legendItems.map((item) => (
            <div key={item.letter} className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-white font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs min-w-7"
                style={{ backgroundColor: item.color }}
              >
                {item.letter}
              </Badge>
              {isExpanded && <span className="text-xs text-gray-700">{item.label}</span>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};