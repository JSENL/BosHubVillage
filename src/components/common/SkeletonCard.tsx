import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SkeletonCardProps {
  variant?: 'event' | 'business' | 'news' | 'local-service';
  viewMode?: 'grid' | 'list';
}

export const SkeletonCard = ({ variant = 'event', viewMode = 'grid' }: SkeletonCardProps) => {
  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden animate-pulse">
        <CardContent className="p-0">
          <div className="flex">
            {/* Hero gradient placeholder */}
            <div className="w-32 h-32 bg-gradient-to-br from-muted to-muted-foreground/20 flex-shrink-0" />
            
            <div className="flex-1 p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full animate-pulse">
      {/* Hero gradient placeholder */}
      <div className="h-24 bg-gradient-to-br from-muted to-muted-foreground/20 relative">
        <div className="absolute top-2 left-2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      </div>
      
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-start justify-between mb-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3 mt-1" />
      </CardHeader>
      
      <CardContent className="pt-2 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="space-y-1.5 pt-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
};

interface SkeletonGridProps {
  count?: number;
  variant?: 'event' | 'business' | 'news' | 'local-service';
  viewMode?: 'grid' | 'list';
}

export const SkeletonGrid = ({ count = 6, variant = 'event', viewMode = 'grid' }: SkeletonGridProps) => {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} variant={variant} viewMode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} variant={variant} viewMode="grid" />
      ))}
    </div>
  );
};

export const SkeletonMapMarkers = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-primary/30 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-8 h-8 rounded-full bg-secondary/30 animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-accent/30 animate-pulse" style={{ animationDelay: '300ms' }} />
      <div className="absolute bottom-1/3 left-1/4 w-8 h-8 rounded-full bg-destructive/30 animate-pulse" style={{ animationDelay: '450ms' }} />
    </div>
  );
};
