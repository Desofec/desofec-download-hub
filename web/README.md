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
2. In the SQL editor, run the migrations in order, including `0004_user_progress.sql`, `0005_user_favorites.sql`, `0006_newsletter_confirmation.sql`, `0007_tutorial_progress.sql`, `0008_learning_workspaces.sql`, `0009_study_board.sql`, and `0010_lesson_feedback.sql`, then `supabase/seed.sql`.
   Both are safe to re-run; the seed upserts.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key
   (Project settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

Catalog tables have row level security enabled with public read-only policies. The `subscribers` table permits
no public access; newsletter signup, confirmation, and unsubscribe use server-only credentials. Configure
`SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` as private Vercel environment variables (never share or expose
them), and set `NEXT_PUBLIC_SITE_URL` to the deployed site URL. Resend must have a verified sending domain and
`NEWSLETTER_FROM_EMAIL` must use that domain. New signups receive a confirmation email; only confirmed addresses
are eligible for future newsletter sends. Existing addresses must confirm again before being treated as subscribed.
Catalog reads are cached for an hour (`lib/catalog.ts`).

### Lesson feedback and the first-website challenge

`/challenges/first-website` reuses the website tutorial content as seven daily tasks with its own
`tutorial` progress ID (`first-website-challenge`). It appears on home, My progress and the tutorial index.
The final checklist shares the existing `ai-website-kit` checklist and its progress. There are no calendar
locks, deadlines or missed-day penalties. The challenge instructions are currently English; the surrounding
UI follows the selected language and displays the existing English-content notice.

Feedback requires sign-in. Migration `0010_lesson_feedback.sql` stores one changeable helpful/not-helpful
vote per account and lesson, without text comments. Learners can read/delete only their own votes; writes
use `save_lesson_feedback`, which derives the account from the session and accepts an existing path ID or
the first-website challenge ID. Votes are deleted with the account.
Run the migration **before deploying** the feedback UI; no seed update is required for this feature.
Signed-out and backend-free visitors can still learn but cannot submit votes.

The site owner can inspect aggregate results in the Supabase SQL Editor (not a public endpoint):

```sql
select lesson_id,
       count(*) filter (where helpful) as helpful_votes,
       count(*) filter (where not helpful) as not_helpful_votes
from public.lesson_feedback
group by lesson_id;
```

`supabase/tests/lesson_feedback.sql` and `supabase/tests/study_board.sql` are regression scripts for isolated
test databases with the matching migrations applied. Do not run these fixture scripts against production.
For a read-only live study-board setup check, use `select to_regclass('public.study_posts');`.
Then sign in with Google, create a workspace, post and remove a card. Approval/joining requires a second
consenting test account; never share passwords, session tokens or private account data.

For email sign-in, keep the Supabase email provider enabled and add the deployed account URL (for example
`https://your-domain.example/account`) under Authentication → URL Configuration → Redirect URLs. Add local
development URLs there too if you test sign-in locally.

## AI Business Launchpad

`/business-launchpad` starts with `/tutorials/ai-automation-services`: six lessons covering discovery,
bounded scope, a six-event fictional enquiry demo, costs, a draft offer and handover. The practice workflow
prepares drafts for human review and never requires real customer data, paid tools or automatic sending.
The hub, catalog and checklist UI are translated; the tutorial and Markdown download are currently English
and visibly labelled. Costs are illustrative, not market prices or earnings promises.

The hub checklist shares `ai-automation-services-kit` progress with its starter-pack page. The tutorial
uses the existing independent `tutorial` progress type; no client notes or cost worksheets are submitted.
Home, My progress, the footer, goal recommendations, idea matching and sitemap link to the new content.

**Deployment: re-run the regenerated `supabase/seed.sql` before deploying** when using Supabase so the
new goal, path, recommendations and kit are available. No new migration is needed. The existing
`0010_lesson_feedback.sql` migration must already be applied for private tutorial feedback.

### Pilot Proposal Builder

`/business-launchpad/proposal-builder` uses guided templates, not an AI API. It calculates setup labour
plus labour contingency and other costs, and monthly support plus vendor/other costs, with cents-based
rounding. All amounts use EUR. Proposed service fees are independent inputs; internal cost estimates
are **not included** in the generated client-facing document. Blank costs mean unknown, not zero.
Numbers accept a decimal comma or point (two places), reject negatives, grouping and exponents, and
enforce displayed limits. No tax, margin or profit calculation is implied.

The generated plain-text draft remains editable. Changing the source form or interface language blocks
export until rebuilding, with confirmation before replacing manual edits. Downloads contain the edited
text; printing/Save as PDF uses scoped print styles and excludes the form, internal costs and navigation.
Unknown details remain marked for confirmation. UI and template headings follow the selected language;
user-written text is never translated.

Save/Load/Delete are explicit and use one versioned browser-local draft (`desofec:pilot-proposal:v1`).
There is no automatic save, account sync or backend write. Load validates stored data and asks before
replacing unsaved work; failed storage operations report an error and retain the current form.
Deletion removes only the saved browser copy, not the current form or downloads. Browser storage is
shared within the profile, not app-encrypted, and can be cleared; use fictional/anonymised inputs only.
This builder requires **no new seed or migration** (the Launchpad catalog seed remains a prerequisite
for the separate learning path).

## Update the catalog

`data/*.json` and `downloads/` in the repository root remain the source of truth. After editing them, run:

```bash
npm run validate-content
npm run sync-content
```

Validation checks required fields, unique IDs, cross-references, starter-pack checklists, and downloadable files.
Sync runs the same checks before copying the files into `content/` and `public/downloads/` and regenerating
`../supabase/seed.sql`. Commit the results, then re-run the seed in Supabase when catalog data changes.

`data/tool-reviews.json` records dated **description** reviews from indexed official documentation for the
six tools researched on 2026-11-05. It does not claim successful live link checks. Other tools display that
no review is recorded. Entries bind the reviewed description and tool URL; validation rejects changed text
or URLs until the review is updated or removed. The bundled metadata is joined in both catalog loaders,
including Supabase catalogs, so these labels require no database column or seed change.

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
- Tool favorites are stored in browser local storage and listed on `/my-progress`; when signed in they also sync to Supabase (`user_favorites`) across devices.
- Migration `0008_learning_workspaces.sql` establishes private workspace, membership, invitation, and explicitly shared catalog-item tables. Row Level Security restricts access to members; invitation acceptance requires a signed-in account whose email matches the invitation. Individual learning progress is not shared.

## Known limitations

- To enable cross-device progress, apply all migrations and add the deployed
  `/account` URL to Supabase Authentication's allowed redirect URLs. Without that migration/configuration,
  device-only progress still works, but sign-in progress sync will report an error.
- Email magic links require Supabase Authentication's email provider to be enabled and configured.

- Unknown `/results/[goal]` and `/paths/[id]` URLs show the 404 page but return HTTP 200 (documented behavior with
  Cache Components, where streaming starts before `notFound()` runs). The pages are marked `noindex`.
On iPhone/iPad, use Safari's **Share → Add to Home Screen**. PWA installation and service workers require HTTPS (Vercel provides it; localhost is also treated as secure during development).
