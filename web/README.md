# Desofec AI Studio — Next.js app

Next.js (App Router, Cache Components) version of Desofec AI Studio. It reads the catalog (goals, tools, learning
paths, starter packs, recommendations) from Supabase when configured, and falls back to the bundled JSON in
`content/` otherwise, so it runs with no backend.

The static GitHub Pages site in the repository root is unchanged and keeps deploying as before.

## Run locally

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

The app is installable on supported browsers. Use the browser's **Install app** button
when available, or its menu option. The service worker caches visited pages, app assets,
and starter pack downloads; the offline page appears when a page has not been cached yet.

## Connect Supabase

1. Create a Supabase project.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
   Both are safe to re-run; the seed upserts.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key
   (Project settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

All tables have row level security enabled with public read-only policies. Only the anon key is used; writes need
the service role and are intentionally not done from the app. Catalog reads are cached for an hour
(`lib/catalog.ts`).

## Update the catalog

`data/*.json` and `downloads/` in the repository root remain the source of truth. After editing them, run:

```bash
npm run validate-content
npm run sync-content
```

Validation checks required fields, unique IDs, cross-references, and downloadable files. Sync runs the same
checks before copying the files into `content/` and `public/downloads/` and regenerating `../supabase/seed.sql`.
Commit the results, then re-run the seed in Supabase.

## Structure

- `app/` — routes: `/`, `/onboarding`, `/results/[goal]`, `/tools`, `/paths`, `/paths/[id]`, `/starter-packs`
- `components/` — shared cards, header, onboarding form, tools search/filter
- `lib/catalog.ts` — cached `getCatalog()`; `lib/catalog-source.ts` — Supabase and bundled loaders
- `scripts/sync-content.mjs` — content sync and seed generation

## Known limitations

- Unknown `/results/[goal]` and `/paths/[id]` URLs show the 404 page but return HTTP 200 (documented behavior with
  Cache Components, where streaming starts before `notFound()` runs). The pages are marked `noindex`.
- The newsletter form from the static site is not ported because there is no backend to store emails yet.

On iPhone/iPad, use Safari's **Share → Add to Home Screen**. PWA installation and service workers require HTTPS (Vercel provides it; localhost is also treated as secure during development).
