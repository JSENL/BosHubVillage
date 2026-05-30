import { Link, useLocation } from 'react-router-dom';
import { useSsrPrefetch } from '@/contexts/SsrPrefetchContext';
import { eventDetailPath } from '@/lib/eventUrl';
import { ChevronDown } from 'lucide-react';

const MAX_VISIBLE = 8;

/**
 * Crawlable upcoming-events list for the homepage (SSR prefetch).
 * Rendered below main content in a collapsed block so it does not compete with the map UI.
 */
export function SeoUpcomingEventsSection() {
  const { pathname } = useLocation();
  const ssr = useSsrPrefetch();

  if (pathname !== '/' || ssr?.type !== 'home' || !ssr.data.upcomingEvents.length) {
    return null;
  }

  const events = ssr.data.upcomingEvents.slice(0, MAX_VISIBLE);

  return (
    <section
      id="upcoming-boston-events"
      aria-labelledby="seo-upcoming-heading"
      className="border-t border-border/60 bg-muted/20"
    >
      <details className="group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
          <span id="seo-upcoming-heading">Upcoming Boston events on HubVillage</span>
          <ChevronDown
            className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <p className="mt-2 text-xs text-muted-foreground">
          Browse upcoming listings — the map and filters above are the main way to explore.
        </p>
        <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id} className="truncate">
              <Link
                to={eventDetailPath({ slug: event.slug, id: event.id })}
                className="text-primary hover:underline"
              >
                {event.title}
              </Link>
              <span className="text-muted-foreground">
                {' '}
                · {event.date}
                {event.location ? ` · ${event.location}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
