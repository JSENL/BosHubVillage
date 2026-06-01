# Search engine setup (Google & Bing)

HubVillage ships technical SEO assets in the repo. **Submitting** sitemaps and monitoring coverage is done in each provider’s dashboard (requires your Google/Microsoft login).

## What is already deployed in code

| Asset | URL |
|--------|-----|
| Sitemap (dynamic + build) | https://bos-hub-village.vercel.app/sitemap.xml |
| robots.txt | https://bos-hub-village.vercel.app/robots.txt |
| llms.txt (AI crawlers) | https://bos-hub-village.vercel.app/llms.txt |
| Public search (SSR) | https://bos-hub-village.vercel.app/search?q=your+query |

Set `PUBLIC_SITE_URL=https://bos-hub-village.vercel.app` (or your custom domain) in Vercel env so sitemap, canonical URLs, and SSR JSON-LD stay consistent.
| Google verification meta | In `index.html` (`google-site-verification`) |

After each production deploy, the sitemap is regenerated at build time and refreshed hourly via `api/sitemap.js`.

## Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property **URL prefix**: `https://hubvillage.app` (or Domain property if you control DNS).
3. Verify ownership (HTML tag in `index.html` is already present — use **HTML tag** method).
4. **Sitemaps** → Submit: `https://hubvillage.app/sitemap.xml`
5. **URL inspection** → Test a few URLs:
   - `https://hubvillage.app/`
   - `https://hubvillage.app/event/{slug}`
   - `https://hubvillage.app/search?q=boston`
6. Use **Rich Results Test** on an event URL for `Event` structured data.

## Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Add site `https://hubvillage.app`.
3. Verify (import from Google Search Console if available, or HTML meta tag).
4. **Sitemaps** → Submit: `https://hubvillage.app/sitemap.xml`

## Optional: IndexNow

For faster Bing/Yandex discovery, you can add [IndexNow](https://www.indexnow.org/) key file under `public/` and ping on publish — not configured by default.

## Monitoring checklist (monthly)

- [ ] Coverage errors in Search Console (404, redirect, excluded)
- [ ] Sitemap “Success” with expected URL count (~500+)
- [ ] Core Web Vitals / mobile usability
- [ ] Spot-check `curl -sL https://hubvillage.app/event/SOME-SLUG | head -80` for title + JSON-LD in HTML

## Local verification script

```bash
npm run verify:sharing
```

Checks robots and basic meta on `BASE_URL` (defaults to production if set).
