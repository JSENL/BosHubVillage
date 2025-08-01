import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const MapLegend = () => {
  const legendItems = [
    { letter: 'E', label: 'Event', color: 'bg-blue-500' },
    { letter: 'B', label: 'Business', color: 'bg-green-500' },
    { letter: 'L', label: 'Local Resource', color: 'bg-purple-500' },
    { letter: 'N', label: 'News', color: 'bg-orange-500' },
    { letter: 'P', label: 'Past Event', color: 'bg-gray-500' }
  ];

  return (
    <Card className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm border shadow-lg">
      <CardContent className="p-3">
        <h4 className="text-sm font-semibold mb-2 text-gray-800">Map Legend</h4>
        <div className="space-y-1">
          {legendItems.map((item) => (
            <div key={item.letter} className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`${item.color} text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs p-0`}
              >
                {item.letter}
              </Badge>
              <span className="text-xs text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};