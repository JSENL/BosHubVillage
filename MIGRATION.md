# Migration Guide: Vite SSR → Next.js

## What's Been Done

### 1. Vite Built-in SSR (Complete ✅)
- **Entry points**: `src/entry-client.tsx` (hydration) and `src/entry-server.tsx` (SSR)
- **Server**: Express server in `server/index.js` with Vite middleware mode
- **Run**: `npm run dev:ssr` — serves at http://localhost:5174
- **App changes**: Router moved to entry wrappers; `RecoveryRedirect` and auth listener guarded for SSR

### 2. Next.js Migration (In Progress)
- **App Router** in `src/app/`
- **Routes migrated**: `/`, `/auth`, `/news-page`, `/faq`
- **Run**: `npm run dev:next` — serves at http://localhost:3000
- **Build**: `npm run build:next`

## Remaining Next.js Routes to Add

Create route folders under `src/app/` for each page. Use the pattern:

```
src/app/[route]/page.tsx
```

| Route | Component |
|-------|-----------|
| `/submit-event` | SubmitEvent |
| `/submit-business` | SubmitBusiness |
| `/submit-local-resource` | SubmitLocalService |
| `/submit-news` | SubmitNews |
| `/admin` | AdminDashboard (wrap in AdminRoute) |
| `/event/[eventId]` | EventDetails |
| `/business/[businessId]` | BusinessDetails |
| `/news/[newsId]` | NewsDetails |
| `/local-resource/[serviceId]` | LocalServiceDetails |
| `/contact-admin` | ContactAdmin |
| `/my-messages` | MyMessages |
| `/my-submissions` | MySubmissions |
| `/user/[userId]` | UserProfile |
| `/edit-profile` | EditProfile |
| `/business-dashboard` | BusinessDashboard |

## Switching to Next.js Fully

1. Update `package.json` scripts: set `"dev": "next dev"` and `"build": "next build"`
2. Add `not-found.tsx` in `src/app/` for 404
3. Add loading states: `loading.tsx` per route if desired
4. Consider server components for data fetching where possible
5. Remove Vite/Express SSR when no longer needed

## Notes
- Both Vite SSR and Next.js share the same components in `src/`
- `src/pages/` contains page components (not Next.js route files)
- Next.js uses file-based routing: `src/app/faq/page.tsx` → `/faq`
