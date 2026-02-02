import { useState, useRef, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export const PullToRefresh = ({ children, onRefresh, disabled = false }: PullToRefreshProps) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const THRESHOLD = 80;
  const MAX_PULL = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    const container = containerRef.current;
    if (container && container.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling.current || disabled || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (diff > 0) {
      e.preventDefault();
      const dampedDistance = Math.min(diff * 0.5, MAX_PULL);
      setPullDistance(dampedDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling.current || disabled) return;
    isPulling.current = false;

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(60);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const rotation = pullDistance * 2;

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto touch-pan-y lg:touch-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 flex justify-center pointer-events-none z-10 transition-transform duration-200"
        style={{
          transform: `translateY(${pullDistance - 40}px)`,
          opacity: Math.min(pullDistance / 40, 1)
        }}
      >
        <div
          className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center transition-colors ${
            pullDistance >= THRESHOLD ? 'bg-primary/20' : ''
          }`}
        >
          <RefreshCw
            className={`h-5 w-5 text-primary transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
              opacity: progress
            }}
          />
        </div>
      </div>

      {/* Content with transform */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling.current ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};
