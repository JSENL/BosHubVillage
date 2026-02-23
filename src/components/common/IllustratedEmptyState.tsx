import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Search, 
  Building, 
  Newspaper,
  Filter,
  RefreshCw,
  Plus
} from 'lucide-react';

type EmptyStateVariant = 'search' | 'events' | 'business' | 'news' | 'local-service' | 'map' | 'filter';

interface IllustratedEmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

const illustrations: Record<EmptyStateVariant, React.ReactNode> = {
  search: (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-pulse" />
      <div className="absolute inset-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full" />
      <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-primary" />
      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
        <span className="text-muted-foreground text-lg">?</span>
      </div>
    </div>
  ),
  events: (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-secondary/20 rounded-2xl rotate-3" />
      <div className="absolute inset-2 bg-card rounded-xl shadow-sm border flex flex-col items-center justify-center -rotate-3">
        <Calendar className="h-10 w-10 text-destructive mb-1" />
        <div className="w-12 h-0.5 bg-muted rounded" />
        <div className="w-8 h-0.5 bg-muted rounded mt-1" />
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
        <span className="text-primary-foreground text-xs font-bold">0</span>
      </div>
    </div>
  ),
  business: (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-20 bg-gradient-to-t from-muted to-transparent rounded-t-lg" />
      <Building className="absolute bottom-2 left-1/2 -translate-x-1/2 h-16 w-16 text-primary" />
      <div className="absolute top-4 left-4 w-4 h-4 bg-secondary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="absolute top-8 right-6 w-3 h-3 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
      <div className="absolute top-2 right-4 w-2 h-2 bg-destructive/50 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
    </div>
  ),
  news: (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-28 bg-card rounded-lg shadow-md border transform -rotate-6 absolute" />
        <div className="w-24 h-28 bg-card rounded-lg shadow-md border transform rotate-3 absolute">
          <div className="p-2 space-y-1.5">
            <div className="w-full h-2 bg-muted rounded" />
            <div className="w-3/4 h-2 bg-muted rounded" />
            <div className="w-full h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded mt-2" />
            <div className="w-full h-1.5 bg-muted rounded" />
            <div className="w-2/3 h-1.5 bg-muted rounded" />
          </div>
        </div>
      </div>
      <Newspaper className="absolute bottom-0 right-0 h-8 w-8 text-muted-foreground" />
    </div>
  ),
  'local-service': (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full" />
      <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 text-accent" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-foreground/20 rounded-full blur-sm" />
    </div>
  ),
  map: (
    <div className="relative w-40 h-32 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-muted to-secondary/10 rounded-xl border-2 border-dashed border-muted-foreground/30" />
      <div className="absolute top-3 left-4 w-2 h-2 bg-destructive rounded-full" />
      <div className="absolute top-8 right-6 w-2 h-2 bg-primary rounded-full" />
      <div className="absolute bottom-6 left-8 w-2 h-2 bg-accent rounded-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-1" />
          <div className="text-xs text-muted-foreground">No pins</div>
        </div>
      </div>
    </div>
  ),
  filter: (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <Filter className="h-16 w-16 text-muted-foreground/50" />
      </div>
      <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-pulse">
        <span className="text-primary-foreground text-xs">✕</span>
      </div>
    </div>
  ),
};

const emptyStateKeys: Record<EmptyStateVariant, { title: string; description: string }> = {
  search: { title: 'emptyStates.noResultsFound', description: 'emptyStates.tryAdjustingFilters' },
  events: { title: 'emptyStates.noEventsScheduled', description: 'emptyStates.noEventsDesc' },
  business: { title: 'emptyStates.noBusinessesFound', description: 'emptyStates.noBusinessesDesc' },
  news: { title: 'emptyStates.noNewsArticles', description: 'emptyStates.noNewsDesc' },
  'local-service': { title: 'emptyStates.noLocalServicesFound', description: 'emptyStates.noLocalServicesDesc' },
  map: { title: 'emptyStates.noLocationsToDisplay', description: 'emptyStates.noLocationsDesc' },
  filter: { title: 'emptyStates.noMatchesForFilters', description: 'emptyStates.tryClearingFilters' },
};

export const IllustratedEmptyState = ({
  variant = 'search',
  title,
  description,
  actionLabel,
  onAction,
  showRefresh = false,
  onRefresh,
}: IllustratedEmptyStateProps) => {
  const { t } = useTranslation();
  const keys = emptyStateKeys[variant];
  const content = {
    title: title || t(keys.title),
    description: description || t(keys.description),
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="mb-6">
        {illustrations[variant]}
      </div>
      
      {/* Text content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 text-center">
        {content.title}
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        {content.description}
      </p>
      
      {/* Actions */}
      <div className="flex gap-3">
        {showRefresh && onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.refresh')}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button size="sm" onClick={onAction}>
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
