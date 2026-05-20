import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Newspaper } from 'lucide-react';
import { UnifiedItem } from '@/types/unifiedItem';
import NewsCard from '@/components/NewsCard';
import { getNewsCardData } from '@/utils/cardTranslationData';
import { Button } from '@/components/ui/button';
import { CULTURE_SPOTLIGHT_MAX_ITEMS } from '@/constants/cultureSpotlight';
import { getNeighborhoodCultureSpotlightItems } from '@/utils/culture/getNeighborhoodCultureSpotlightItems';

interface CultureSpotlightSectionProps {
  items: UnifiedItem[];
  /** When true and there are no items yet, show row skeletons */
  isLoading?: boolean;
  /** Narrow sidebar layout (discovery column) */
  variant?: 'default' | 'sidebar';
}

/**
 * Home “Neighborhood culture” strip: same published news pool as the admin table (via shared
 * `['news']` query + cache updates on delete), shown newest-first with a hard cap of
 * {@link CULTURE_SPOTLIGHT_MAX_ITEMS} cards.
 */
export function CultureSpotlightSection({
  items,
  isLoading = false,
  variant = 'default',
}: CultureSpotlightSectionProps) {
  const { t } = useTranslation();
  const isSidebar = variant === 'sidebar';

  const cultureItems = useMemo(
    () => getNeighborhoodCultureSpotlightItems(items, CULTURE_SPOTLIGHT_MAX_ITEMS),
    [items],
  );

  const title = t('cultureSpotlight.title', { defaultValue: 'Neighborhood culture' });
  const subtitle = t('cultureSpotlight.subtitle', {
    defaultValue: 'Stories, voices, and local context from your community.',
  });
  const browseAll = t('cultureSpotlight.browseAll', { defaultValue: 'Browse all culture' });
  const emptyTitle = t('cultureSpotlight.emptyTitle', { defaultValue: 'Culture lives here' });
  const emptyBody = t('cultureSpotlight.emptyBody', {
    defaultValue: 'Stories and local angles will show up here. Explore the culture hub or share a piece.',
  });
  const exploreHub = t('cultureSpotlight.exploreHub', { defaultValue: 'Open culture hub' });
  const shareStory = t('cultureSpotlight.shareStory', { defaultValue: 'Submit a story' });

  return (
    <section
      className={
        isSidebar
          ? 'relative w-full max-w-full overflow-hidden rounded-xl border-2 border-blue-600/20 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-slate-50/90 p-3 shadow-sm'
          : 'relative overflow-hidden rounded-2xl border-2 border-blue-600/20 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-slate-50/90 p-4 shadow-md sm:p-6'
      }
      aria-labelledby="culture-spotlight-heading"
      data-testid="culture-spotlight-section"
    >
      <div className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-blue-400/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl" />

      <div
        className={
          isSidebar
            ? 'relative flex flex-col gap-3'
            : 'relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6'
        }
      >
        <div className={`flex min-w-0 flex-1 gap-3 ${isSidebar ? '' : 'sm:gap-4'}`}>
          <div
            className={
              isSidebar
                ? 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md'
                : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md sm:h-14 sm:w-14'
            }
            aria-hidden
          >
            <Newspaper className={isSidebar ? 'h-5 w-5' : 'h-6 w-6 sm:h-7 sm:w-7'} />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {t('navigation.news', { defaultValue: 'Culture' })}
            </p>
            <h2
              id="culture-spotlight-heading"
              className={
                isSidebar
                  ? 'text-base font-bold tracking-tight text-slate-900 leading-snug'
                  : 'text-lg font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl'
              }
            >
              {title}
            </h2>
            <p className={`mt-1 text-sm text-slate-600 ${isSidebar ? 'line-clamp-2' : 'max-w-2xl sm:text-base'}`}>
              {subtitle}
            </p>
          </div>
        </div>
        <Button
          asChild
          className={
            isSidebar
              ? 'w-full shrink-0 bg-blue-600 text-white hover:bg-blue-700'
              : 'w-full shrink-0 bg-blue-600 text-white hover:bg-blue-700 sm:w-auto'
          }
          size={isSidebar ? 'sm' : 'lg'}
        >
          <Link to="/news-page" className="inline-flex items-center justify-center gap-2">
            {browseAll}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className={isSidebar ? 'relative mt-3' : 'relative mt-5 sm:mt-6'}>
        {isLoading && cultureItems.length === 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2" aria-busy="true" aria-label={title}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={
                  isSidebar
                    ? 'h-[240px] w-44 shrink-0 animate-pulse rounded-xl border border-slate-200/80 bg-white/60'
                    : 'h-[280px] w-52 shrink-0 animate-pulse rounded-xl border border-slate-200/80 bg-white/60 sm:w-64'
                }
              />
            ))}
          </div>
        ) : cultureItems.length > 0 ? (
          <div className="-mx-0.5 flex gap-3 overflow-x-auto px-0.5 pb-2 pt-1 scroll-smooth [-webkit-overflow-scrolling:touch]">
            {cultureItems.map((item) => (
              <div
                key={`culture-spotlight-${item.id}`}
                data-testid="culture-spotlight-card"
                className={isSidebar ? 'w-44 shrink-0' : 'w-[min(100%,17rem)] shrink-0 sm:w-64'}
              >
                <NewsCard news={getNewsCardData(item)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-blue-300/60 bg-white/50 px-4 py-8 text-center sm:px-8">
            <p className="font-semibold text-slate-900">{emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{emptyBody}</p>
            <div className="mt-5 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
              <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/news-page">{exploreHub}</Link>
              </Button>
              <Button asChild variant="outline" className="border-blue-600/40 text-blue-800 hover:bg-blue-50">
                <Link to="/submit-news">{shareStory}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CultureSpotlightSection;
