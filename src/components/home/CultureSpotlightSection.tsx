import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Newspaper } from 'lucide-react';
import { UnifiedItem } from '@/types/unifiedItem';
import NewsCard from '@/components/NewsCard';
import { getNewsCardData } from '@/utils/cardTranslationData';
import { Button } from '@/components/ui/button';

const SPOTLIGHT_COUNT = 6;

interface CultureSpotlightSectionProps {
  items: UnifiedItem[];
  /** When true and there are no items yet, show row skeletons */
  isLoading?: boolean;
}

/**
 * Index-page experiment: make Culture (news) visible above the main filter grid.
 */
export function CultureSpotlightSection({ items, isLoading = false }: CultureSpotlightSectionProps) {
  const { t } = useTranslation();

  const cultureItems = useMemo(() => {
    return items
      .filter((i): i is UnifiedItem & { type: 'news' } => i.type === 'news')
      .sort((a, b) => {
        const ta = a.date ? new Date(a.date).getTime() : 0;
        const tb = b.date ? new Date(b.date).getTime() : 0;
        return tb - ta;
      })
      .slice(0, SPOTLIGHT_COUNT);
  }, [items]);

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
      className="relative overflow-hidden rounded-2xl border-2 border-blue-600/20 bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-slate-50/90 p-4 shadow-md sm:p-6"
      aria-labelledby="culture-spotlight-heading"
      data-testid="culture-spotlight-section"
    >
      <div className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-blue-400/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-indigo-400/10 blur-2xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md sm:h-14 sm:w-14"
            aria-hidden
          >
            <Newspaper className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0 pt-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              {t('navigation.news', { defaultValue: 'Culture' })}
            </p>
            <h2
              id="culture-spotlight-heading"
              className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl md:text-2xl"
            >
              {title}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p>
          </div>
        </div>
        <Button
          asChild
          className="w-full shrink-0 bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
          size="lg"
        >
          <Link to="/news-page" className="inline-flex items-center justify-center gap-2">
            {browseAll}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>

      <div className="relative mt-5 sm:mt-6">
        {isLoading && cultureItems.length === 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 sm:gap-4" aria-busy="true" aria-label={title}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[280px] w-52 shrink-0 animate-pulse rounded-xl border border-slate-200/80 bg-white/60 sm:w-64"
              />
            ))}
          </div>
        ) : cultureItems.length > 0 ? (
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 pt-1 scroll-smooth [-webkit-overflow-scrolling:touch] sm:gap-4">
            {cultureItems.map((item) => (
              <div key={`culture-spotlight-${item.id}`} className="w-[min(100%,17rem)] shrink-0 sm:w-64">
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
