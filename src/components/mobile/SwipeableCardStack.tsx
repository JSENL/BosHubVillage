import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UnifiedItem } from '@/types/unifiedItem';
import { useNavigate } from 'react-router-dom';
import { eventDetailPath } from '@/lib/eventUrl';
import { format } from 'date-fns';
import { richTextPlainText } from '@/lib/richText';

interface SwipeableCardStackProps {
  items: UnifiedItem[];
  onClose: () => void;
}

export const SwipeableCardStack = ({ items, onClose }: SwipeableCardStackProps) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentItem = items[currentIndex];
  const hasNext = currentIndex < items.length - 1;
  const hasPrev = currentIndex > 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offsetX > 80 && hasPrev) {
      goToPrev();
    } else if (offsetX < -80 && hasNext) {
      goToNext();
    }
    setOffsetX(0);
  };

  const goToNext = () => {
    if (hasNext) {
      setDirection('left');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDirection(null);
      }, 200);
    }
  };

  const goToPrev = () => {
    if (hasPrev) {
      setDirection('right');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setDirection(null);
      }, 200);
    }
  };

  const handleViewDetails = () => {
    const item = currentItem;
    switch (item.type) {
      case 'event':
        navigate(eventDetailPath({ slug: item.slug, id: item.id }));
        break;
      case 'business':
        navigate(`/business/${item.id}`);
        break;
      case 'local-service':
        navigate(`/local-service/${item.id}`);
        break;
      case 'news':
        navigate(`/news/${item.id}`);
        break;
    }
    onClose();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-500';
      case 'business': return 'bg-green-500';
      case 'local-service': return 'bg-purple-500';
      case 'news': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event': return 'Event';
      case 'business': return 'Business';
      case 'local-service': return 'Service';
      case 'news': return t('navigation.news');
      default: return type;
    }
  };

  if (!currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col lg:hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {items.length}
        </span>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative w-full max-w-sm">
          {/* Background cards for stack effect */}
          {hasNext && (
            <Card className="absolute inset-0 transform translate-y-2 scale-95 opacity-50" />
          )}
          
          {/* Current Card */}
          <Card
            ref={cardRef}
            className={`relative transform transition-transform duration-200 shadow-xl ${
              direction === 'left' ? '-translate-x-full rotate-[-10deg] opacity-0' :
              direction === 'right' ? 'translate-x-full rotate-[10deg] opacity-0' : ''
            }`}
            style={{
              transform: isDragging ? `translateX(${offsetX}px) rotate(${offsetX / 20}deg)` : undefined
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <CardContent className="p-0">
              {/* Image/Gradient Header */}
              <div className={`h-48 ${getTypeColor(currentItem.type)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <Badge variant="secondary" className="mb-2 bg-white/20 text-white border-0">
                    {getTypeLabel(currentItem.type)}
                  </Badge>
                  <h2 className="text-xl font-bold line-clamp-2">{currentItem.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {currentItem.date && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    📅 {format(new Date(currentItem.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                )}
                
                {(currentItem.location || currentItem.address) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    📍 {currentItem.location || currentItem.address}
                  </p>
                )}

                {currentItem.description && (
                  <p className="text-sm line-clamp-3 text-muted-foreground">
                    {richTextPlainText(currentItem.description)}
                  </p>
                )}

                {currentItem.category && (
                  <Badge variant="outline" className="mt-2">
                    {currentItem.category}
                  </Badge>
                )}
              </div>

              {/* Swipe hint */}
              <div className="px-4 pb-4 text-center text-xs text-muted-foreground">
                Swipe left or right to browse
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={goToPrev}
          disabled={!hasPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
          onClick={handleViewDetails}
        >
          <Info className="h-6 w-6" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={goToNext}
          disabled={!hasNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
