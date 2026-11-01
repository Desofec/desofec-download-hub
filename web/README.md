# Desofec AI Studio — Next.js app

Next.js (App Router, Cache Components) version of Desofec AI Studio. It reads the catalog (goals, tools, learning
paths, starter packs, recommendations) from Supabase when configured, and falls back to the bundled JSON in
`content/` otherwise, so it runs with no backend.

The original static site files in the repository root are no longer deployed. GitHub Pages now publishes only
`legacy-redirect/`, which sends visitors of the old `github.io` address to https://www.desofec.com.

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
2. In the SQL editor, run the migrations in order, including `0004_user_progress.sql`, then `supabase/seed.sql`.
   Both are safe to re-run; the seed upserts.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key
   (Project settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

Catalog tables have row level security enabled with public read-only policies. The `subscribers` table permits
public inserts only and does not expose signup emails for reading. Only the anon key is used in the app.
Catalog reads are cached for an hour (`lib/catalog.ts`).

For email sign-in, keep the Supabase email provider enabled and add the deployed account URL (for example
`https://your-domain.example/account`) under Authentication → URL Configuration → Redirect URLs. Add local
development URLs there too if you test sign-in locally.

## Update the catalog

`data/*.json` and `downloads/` in the repository root remain the source of truth. After editing them, run:

```bash
npm run validate-content
npm run sync-content
```

Validation checks required fields, unique IDs, cross-references, starter-pack checklists, and downloadable files.
Sync runs the same checks before copying the files into `content/` and `public/downloads/` and regenerating
`../supabase/seed.sql`. Commit the results, then re-run the seed in Supabase when catalog data changes.

## Structure

- `app/` — routes: `/`, `/onboarding`, `/results/[goal]`, `/tools`, `/paths`, `/paths/[id]`, `/starter-packs`,
  `/my-progress`,
  `/starter-packs/[id]`
- `components/` — shared cards, header, onboarding form, tools search/filter
- `lib/catalog.ts` — cached `getCatalog()`; `lib/catalog-source.ts` — Supabase and bundled loaders
- `scripts/sync-content.mjs` — content sync and seed generation
- `data/starter-pack-checklists.json` — checklist steps shown on starter-pack detail pages; browser progress is
  saved locally and does not require a Supabase migration
- `components/auth-provider.tsx` and `/account` — optional email magic-link sign-in
- `components/progress-sync.tsx` — syncs path and starter-pack progress for signed-in users

## Known limitations

- To enable cross-device progress, apply all migrations and add the deployed
  `/account` URL to Supabase Authentication's allowed redirect URLs. Without that migration/configuration,
  device-only progress still works, but sign-in progress sync will report an error.
- Email magic links require Supabase Authentication's email provider to be enabled and configured.

- Unknown `/results/[goal]` and `/paths/[id]` URLs show the 404 page but return HTTP 200 (documented behavior with
  Cache Components, where streaming starts before `notFound()` runs). The pages are marked `noindex`.
On iPhone/iPad, use Safari's **Share → Add to Home Screen**. PWA installation and service workers require HTTPS (Vercel provides it; localhost is also treated as secure during development).
