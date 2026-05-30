import { Link } from 'react-router-dom';
import { useSsrPrefetch } from '@/contexts/SsrPrefetchContext';
import { eventDetailPath } from '@/lib/eventUrl';

/**
 * Crawlable upcoming-events list for the homepage (populated via SSR prefetch).
 */
export function SeoUpcomingEventsSection() {
  const ssr = useSsrPrefetch();
  if (ssr?.type !== 'home' || !ssr.data.upcomingEvents.length) {
    return null;
  }

  return (
    <section
      id="upcoming-boston-events"
      aria-labelledby="seo-upcoming-heading"
      className="rounded-lg border border-border/80 bg-muted/30 px-4 py-3"
    >
      <h2 id="seo-upcoming-heading" className="text-base font-semibold text-foreground">
        Upcoming Boston events on HubVillage
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Discover local happenings across Greater Boston and Lower Boston neighborhoods.
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {ssr.data.upcomingEvents.map((event) => (
          <li key={event.id}>
            <Link
              to={eventDetailPath({ slug: event.slug, id: event.id })}
              className="font-medium text-primary hover:underline"
            >
              {event.title}
            </Link>
            <span className="text-muted-foreground">
              {' '}
              — {event.date}
              {event.location ? ` · ${event.location}` : ''}
            </span>
            {event.snippet ? (
              <p className="text-muted-foreground line-clamp-2">{event.snippet}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
