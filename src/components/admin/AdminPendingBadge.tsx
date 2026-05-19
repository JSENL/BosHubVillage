import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AdminPendingBadgeProps {
  count: number;
  className?: string;
}

export const AdminPendingBadge = ({ count, className }: AdminPendingBadgeProps) => {
  if (count <= 0) return null;

  return (
    <Badge
      variant="destructive"
      className={cn(
        'ml-2 min-w-[1.25rem] justify-center px-1.5 py-0 text-[10px] leading-none',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </Badge>
  );
};
