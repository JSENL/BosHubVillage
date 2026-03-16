import { Navigation } from '@/components/Navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

/**
 * Shared loading layout for detail pages (event, business, news, local service).
 * Keeps Navigation and page shell so layout doesn’t jump when content loads.
 */
export const DetailPageLoading = () => {
  const { t } = useTranslation();
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <p className="text-center text-muted-foreground text-sm mt-4" aria-live="polite">
            {t('common.loading')}
          </p>
        </div>
      </div>
    </>
  );
};
