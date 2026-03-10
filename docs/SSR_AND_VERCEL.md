# SSR and Google indexing on Vercel

The app uses **build-time prerendering** so the home page (`/`) is full HTML when deployed. That helps Google (and other crawlers) see your content without running JavaScript.

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

## Other routes

Only `/` is prerendered. Other routes (e.g. `/about`, `/events`) are still client-rendered. To make more routes indexable you can:

- Add more URLs to the prerender script (e.g. render `/about` and write to `dist/about/index.html`), or
- Move to full SSR (e.g. Vercel serverless that runs the SSR render per request) or a framework like Next.js.

## Build issues

- **PWA / workbox:** If `vite build` fails during the service worker step, fix or temporarily disable the PWA plugin so the client build completes; the prerender step runs after both client and SSR builds.
- **SSR errors:** If the app uses `window` or other browser-only APIs during render, the prerender script may throw. Make those code paths client-only or guard them for SSR.
