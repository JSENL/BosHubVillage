# SSR and Google indexing on Vercel

The app uses **build-time prerendering** so the home page (`/`) is full HTML when deployed. That helps Google (and other crawlers) see your content without running JavaScript.

**AI / SEO assets:** `public/robots.txt` and `public/llms.txt` use the canonical host `https://hubvillage.app`.

**Sitemap:** `https://hubvillage.app/sitemap.xml` is generated from Supabase on each request (`api/sitemap.js`, cached 1h) and refreshed at build time (`npm run generate-sitemap` → `dist/sitemap.xml`). Includes static pages plus all public events, businesses, culture articles, and local resources.

## How it works

1. **Client build:** `vite build` produces `dist/` (index.html, assets).
2. **SSR build:** `VITE_SSR_BUILD=1 vite build --ssr src/entry-server.tsx` adds `dist/entry-server.js` without clearing `dist/`.
3. **Prerender:** `node scripts/prerender.mjs` runs the SSR render for `/` and replaces `<!--ssr-outlet-->` in `dist/index.html` with that HTML.

Deployed on Vercel, the site is still **static** (no serverless SSR). Only the home page HTML is pre-rendered at build time so crawlers get real content.

## Vercel

- **Build command:** `npm run build` (uses the sequence above).
- **Output directory:** `dist`.
- `vercel.json` sets these so a normal Vercel deploy uses the prerendered build.

## Proving it’s “server-rendered” for Google

1. **View Page Source** (right‑click → View Page Source) on your deployed `/`. You should see the full app markup inside `<div id="root">`, not just an empty div or a loading state.
2. **Google Search Console** → URL Inspection: fetch the URL and check “View crawled page” to see the HTML Google received.
3. **Rich Results Test** / **Mobile-Friendly Test**: use your live URL; they show the rendered content Google uses.

If you see real headings, links, and text in the source of `/`, Google can index that content.

## Detail pages (events, businesses, news, local resources)

On Vercel, `api/ssr.js` runs **`render(url)`** per request:

1. **Prefetch** — loads the record from Supabase by URL (`fetchPrefetchForUrl`).
2. **Head** — injects `<title>`, meta description, Open Graph, Twitter, canonical, and JSON-LD into `<!--ssr-head-start-->` … `<!--ssr-head-end-->`.
3. **Body** — React SSR renders the detail page with `SsrPrefetchProvider` so the first HTML includes the event/business title and description (not only a loading spinner).
4. **Hydration** — `window.__SSR_PREFETCH__` seeds the client so React Query does not refetch immediately.

Home (`/`) is still **build-time prerendered** via `scripts/prerender.mjs` (no Supabase prefetch on build).

## Other static routes

Routes like `/about` and `/faq` use the default head from `index.html` plus client `useDocumentHead` after navigation.

## Build issues

- **PWA / workbox:** If `vite build` fails during the service worker step, fix or temporarily disable the PWA plugin so the client build completes; the prerender step runs after both client and SSR builds.
- **SSR errors:** If the app uses `window` or other browser-only APIs during render, the prerender script may throw. Make those code paths client-only or guard them for SSR.
