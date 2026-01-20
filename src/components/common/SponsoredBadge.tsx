import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SponsoredBadgeProps {
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * A badge component that displays "Sponsored" indicator for premium listings.
 * Uses a gold/amber color scheme to stand out from regular content.
 */
const SponsoredBadge = ({ className, size = 'sm' }: SponsoredBadgeProps) => {
  return (
    <Badge 
      className={cn(
        "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 shadow-sm",
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
        className
      )}
    >
      <Sparkles className={cn("mr-1", size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      Sponsored
    </Badge>
  );
};

export default SponsoredBadge;
