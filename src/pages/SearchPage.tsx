import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/common/Footer';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { useSsrPrefetch } from '@/contexts/SsrPrefetchContext';
import { searchPublicContent, type SsrSearchHit } from '@/lib/ssr/searchPublicContent';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormEvent } from 'react';

const TYPE_LABELS: Record<SsrSearchHit['type'], string> = {
  event: 'Event',
  business: 'Business',
  news: 'Culture',
  local_resource: 'Local resource',
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ssr = useSsrPrefetch();
  const queryParam = searchParams.get('q')?.trim() ?? '';

  const ssrResults =
    ssr?.type === 'search' && ssr.data.query === queryParam ? ssr.data.results : null;

  const [clientResults, setClientResults] = useState<SsrSearchHit[] | null>(null);
  const [searching, setSearching] = useState(false);

  const [draft, setDraft] = useState(queryParam);

  useEffect(() => {
    setDraft(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (!queryParam) {
      setClientResults(null);
      return;
    }
    if (ssrResults) {
      setClientResults(ssrResults);
      return;
    }

    let cancelled = false;
    setSearching(true);
    searchPublicContent(supabase, queryParam)
      .then((hits) => {
        if (!cancelled) setClientResults(hits);
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryParam, ssrResults]);

  const results = ssrResults ?? clientResults;

  const title = queryParam
    ? `Search: ${queryParam} | HubVillage`
    : 'Search Boston events & community | HubVillage';
  const description = queryParam
    ? `Search results for "${queryParam}" — events, businesses, culture, and local resources in Greater Boston on HubVillage.`
    : 'Search HubVillage for Boston-area events, businesses, culture articles, and community resources.';

  useDocumentHead(title, description, {
    path: queryParam ? `/search?q=${encodeURIComponent(queryParam)}` : '/search',
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = draft.trim();
    if (q) setSearchParams({ q });
    else setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      <Navigation />
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search HubVillage</h1>
        <p className="text-muted-foreground mb-6">
          Find events, businesses, culture, and local resources across Greater Boston.
        </p>

        <form onSubmit={onSubmit} className="flex gap-2 mb-8" role="search">
          <Input
            type="search"
            name="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. jazz Dorchester, library, restaurant"
            className="flex-1"
            aria-label="Search query"
          />
          <Button type="submit">Search</Button>
        </form>

        {queryParam ? (
          <section aria-labelledby="search-results-heading">
            <h2 id="search-results-heading" className="text-lg font-semibold mb-4">
              Results for &ldquo;{queryParam}&rdquo;
            </h2>
            {searching && !results ? (
              <p className="text-muted-foreground">Searching…</p>
            ) : null}
            {results && results.length === 0 && !searching ? (
              <p className="text-muted-foreground">No matches found. Try a different keyword or browse the map.</p>
            ) : null}
            {results && results.length > 0 ? (
              <ul className="space-y-4">
                {results.map((hit) => (
                  <li key={`${hit.type}-${hit.id}`} className="rounded-lg border bg-white/80 p-4">
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {TYPE_LABELS[hit.type]}
                    </span>
                    <h3 className="text-lg font-semibold mt-1">
                      <Link to={hit.path} className="text-primary hover:underline">
                        {hit.title}
                      </Link>
                    </h3>
                    {hit.snippet ? (
                      <p className="text-sm text-muted-foreground mt-1">{hit.snippet}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : (
          <p className="text-muted-foreground">Enter a keyword to search published community content.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
