import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Building, 
  Heart, 
  Newspaper,
  MapPin,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';

interface MobileCategoryChipsProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  onQuickAction?: (action: string) => void;
}

export const MobileCategoryChips = ({ 
  selectedType, 
  onTypeChange,
  onQuickAction 
}: MobileCategoryChipsProps) => {
  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'event', label: 'Events', icon: Calendar },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'local-service', label: 'Services', icon: Heart },
    { id: 'news', label: 'News', icon: Newspaper },
  ];

  const quickActions = [
    { id: 'near-me', label: 'Near Me', icon: MapPin },
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'popular', label: 'Popular', icon: Star },
  ];

  return (
    <div className="space-y-2 lg:hidden">
      {/* Category Pills */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedType === category.id;
            return (
              <Button
                key={category.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onTypeChange(category.id)}
                className={`flex-shrink-0 gap-1.5 rounded-full px-3 h-8 text-xs transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                    : 'hover:bg-muted hover:scale-102'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {category.label}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* Quick Actions */}
      {onQuickAction && (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onQuickAction(action.id)}
                  className="flex-shrink-0 gap-1.5 rounded-full px-3 h-7 text-xs bg-muted/50 hover:bg-muted transition-all duration-200 hover:scale-102"
                >
                  <Icon className="h-3 w-3" />
                  {action.label}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      )}
    </div>
  );
};
