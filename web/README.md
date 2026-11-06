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

### Guided first project

`/business-launchpad/first-project` recommends AI Content Services for a first no-code, fictional
practice package. Goal selection links to the existing workspace with a preselected path; it does not
create a project or upload anything. All five goals have six-stage guided journeys and private
portfolios, with service-specific instructions, evidence and explicit scope boundaries.

Service projects (including existing ones and loaded account snapshots) show six sequential milestones
derived from **saved** project data: learn, practise, draft, test, review and handover. They reuse the
existing checklist; no progress keys or record schemas change. Learn/practise/handover are self-recorded
work, not proof of tutorial completion or file inspection. Draft requires a current generated proposal
and seven scope/review fields; automation, micro-SaaS and education additionally require data handling,
and education requires a timeline. Content retains its four-distinct-named-case rule. Other services
require exactly one evidenced case for every bracketed service code, not just an arbitrary test count.
Each requires input, expected and actual evidence, a non-pending outcome, and the evidence checklist.
Duplicate codes and unsupported passes/retests do not count. A supported failed/blocked case counts
as recorded evidence, not success; unavailable real owner approval must stay blocked. Review requires
an explicit decision, rationale, uncertainty, next steps and the review item. Handover requires all prior
milestones and the handover item; no milestone grants publication permission or client approval.

| Service | Required recorded cases | Boundary |
| --- | --- | --- |
| Automation | AUTO-1 through AUTO-9: six ordered events, failure/retry, off switch/manual fallback, authorised customer review | Fictional queue; never send messages or enable live work |
| CAD | CAD-1 through CAD-5: base dimensions, revision, reopened exports, method/licensing, required review | CAD or paper-only, explicitly not for manufacture |
| Micro-SaaS | SAAS-1 through SAAS-8: exact output, blank/40/41/markup/invalid status, observed demand, costs/launch gaps | Local toy; manual work cannot establish browser passes; no subscriptions |
| Education | EDU-1 through EDU-5: facts/key, rehearsal timing, accessible original materials, adult trial, independent review | Consenting-adult practice; no learner records or qualification claims |

After **Reload project draft**, the results tool offers **Load required service test plans** for these
four services. Replacement requires confirmation, changes only current test cases, and never fills in
actual evidence, original/retest outcomes, correction or retest notes. Context, metrics and decision stay
unchanged. Save explicitly. Content and standalone workshop plans keep their previous behavior.
Existing projects are never rewritten: add bracketed codes to matching historical cases manually, or
back up evidence before choosing replacement. Codes are stable across interface languages; user text
and recorded evidence are not automatically translated. The model checks recorded fields, not whether
the learner truly performed a test. Missing real trials/review can be recorded blocked with reasons,
allowing a practice record without pretending success.

The private practice-portfolio preview is derived from saved data, not stored separately or published.
It retains incomplete status, failed/blocked/pending counts and the recorded decision. It omits full
proposal text, structured financial fields and raw test evidence; titles and notes remain user text and
must be checked before manual sharing. Download requires explicit review acknowledgement; unsaved
brief/checklist changes disable it. Saving a new project revision resets that acknowledgement.
Original deliverables (including posts, sketches, prototypes and handouts) stay in the learner's own
storage. Portfolio filenames identify their service. Track boundaries and required-case coverage are
included in new service exports; assembled records are not production-readiness assessments.
Tool **Back to project** links deliberately use document navigation so Next's retained route state
cannot show an older workspace revision after saving a draft. The tool's existing `beforeunload`
guard protects unsaved edits. If returning through browser history or editing in another tab,
**Refresh device projects** explicitly reloads saved evidence with a discard confirmation if needed.

**No new seed or migration is needed for this journey.** It uses PR #95's existing migration 0011
for optional account snapshots. Device/account deletion and existing privacy controls are unchanged.

### Private Project Evidence Workbook

Open a saved project, then **Open private evidence workbook**. The private, `noindex`
`/business-launchpad/evidence-workbook?project=<uuid>` route requires explicit **Reload saved project
and workbook** before editing. It is not a standalone scratchpad. Each project can retain eight text
items, with five explicitly saved revisions per item and 8,000 characters per revision. Each revision
preserves its title, body, sequence number and save time. No autosave, background AI, binary uploads,
script execution, CAD preview or independent assessment is added. Service starters are optional text
outlines with no invented outcomes. Older revisions can be copied into an unsaved draft and saved as
a new revision; history is never overwritten or pruned automatically. Delete item removes its history
and references from that device project only.

Test references pin a saved text revision to the saved test ID, name, input and expected result.
Changing a test definition, removing a test or creating a newer text revision is visibly flagged for
review. A link is not immutable proof of a test run: results may be edited, and a reused ID with the
same definition denotes the same reference. Link/unlink operations never fill actual evidence,
change pass/fail/retest outcomes or complete journey milestones. The results tool shows references
from its reloaded saved project; workbook bodies are not copied into results reports, internal
summaries or practice portfolios.

`PilotProject.version` remains 1 with an optional, strictly validated `workbook` property. Legacy
projects round-trip without adding it. Workbook changes use the same shared Web Lock and
`saveProjectPart` compare-and-swap as proposal/results drafts, preserving unrelated current parts and
rejecting stale workbook edits or deleted projects. Invalid workbook data, limits, storage failures and
conflicts are surfaced without replacing the current unsaved draft. The existing one-megabyte
project limit remains the final bound.

**No new database migration or seed is required.** Migration 0011's owner-private JSON snapshots
already retain the optional workbook within the existing size limit. Account consent explicitly covers
full text, every retained revision and test references; saving locally never uploads. Device and account
deletion remain separate. Unlike the concise practice portfolio, the explicitly acknowledged workbook
download contains full saved text and all revisions; inspect older text before sharing or uploading.
Downloaded files must be deleted separately. Reload all app tabs after deploying this release: older
app versions do not understand workbook fields and must not be used to edit workbook-bearing snapshots.

### Guided Project Review Centre

`/business-launchpad/review-centre?project=<uuid>` is private/noindex and supports all five
service paths with distinct manual review checks. Reload saved project and reviews, select a
workbook item/revision, then record observations for service-specific risk areas: content claims,
automation event/failure safety, CAD dimensions/exports, prototype boundaries or education facts,
timing and privacy. Every non-pending check needs observations; a correction status needs a task.
Marking a task addressed requires written evidence, and never changes its review status, test
outcome or project milestone.

The optional `reviewCentre` project part stores at most eight reviews, one per text item.
Each pins a full copy of its reviewed revision so deleting/reusing a workbook ID cannot silently
reattach feedback. Newer or missing/replaced text is explicitly flagged. Reviewing another
revision starts with pending checks; replacing an item's saved review requires confirmation.
An archived review reserves its deleted workbook item ID until that review is deleted, preventing
an identical new draft from accidentally appearing to be the archived source.
Review saves compare only their own part, validate the selected source against current storage,
preserve unrelated parts and reject deleted projects. The existing UTF-8 project size bound applies.

Select saved reviews and acknowledge sensitive-data review to download a saved-only text
handover pack. It includes selected copied revisions, feedback, correction evidence, test
names/effective outcomes, decision, uncertainty and next actions, including unresolved/archived
records. It omits unselected text, full proposals, raw test evidence and structured costs.
Downloads are never public pages or approval. Deleting workbook items leaves review copies;
delete saved reviews, account snapshots and downloads separately.

No new migration or seed is required; existing migration 0011 retains optional review JSON.
Account upload consent explicitly includes copied review text. Reload all tabs after deployment;
older app versions must not edit review-bearing projects because they do not retain this field.

### Project storage and account snapshots

`/business-launchpad/projects` creates up to ten device projects from the five service paths.
Each owns a brief, independent five-item project checklist, optional proposal/results drafts and a
next-action prompt derived only from saved evidence. Project checklists do not complete tutorial or kit
progress. The path is fixed at creation; start a separate project for another track.

Open a project tool, press **Reload project draft**, then optionally **Start from project brief**.
The latter copies only context, never results/approvals or fees. Save explicitly; standalone drafts
and other projects are not overwritten. Changing a brief does not rewrite existing tool drafts.
Summaries use saved data, omit financial fields/full drafts, and are internal practice records, not
proof of customer approval, engineering readiness, accreditation or income. Review text before sharing.

**Deployment: apply `supabase/migrations/0011_pilot_projects.sql` before deploying this workspace.
No new seed is needed beyond the existing service-path seed from PR #94.**
The migration creates owner-private `pilot_projects`, read-only direct authenticated access and two
security-definer RPCs. Upload uses account-version compare-and-swap; deletion also checks its version.
Per-owner transaction locks serialise writes/quota checks (ten account projects). Auth user deletion
cascades to project snapshots. Do not grant clients direct insert/update/delete permissions.

Account saving is opt-in and manual: consent plus **Upload saved project to my account** sends the
entire saved snapshot, including internal costs. Signing in, editing, local saving and refreshing an
account list do not upload. **Load account copy onto device** explicitly replaces that project's device
copy after confirmation; it never merges records. Conflicts block replacement: refresh the account list
and load its latest copy before uploading again. Download/back up local work before replacing it.
Device and account deletion are separate; downloaded files remain. Account snapshots are private under
RLS, not end-to-end encrypted. Local copies are shared by the browser profile even after sign-out.
Device mutations use a shared Web Lock plus revision/draft comparisons to serialise tabs. Saving needs a
current browser with the Web Locks API in a secure context; unsupported browsers show an explicit error
rather than risking concurrent overwrite. Account requests pin the initiating session token, and switching
accounts resets account-list/consent state without uploading device content.
Operations show failures explicitly. Both sides bound document size (1 MB UTF-8 client limit; 1.1 MB
database serialisation limit), and client validators reuse the existing proposal/results validators.
`npm run test:content` covers the project model, isolation and translations. For an isolated database
with auth fixtures and migration 0011 applied, `supabase/tests/pilot_projects.sql` checks ownership,
permissions, version conflicts, limits, deletion and cascade behavior; its fixtures roll back.

The Launchpad now lists five service paths. Four additions have six lessons each:
`ai-content-services` (fictional bakery package and revisions), `ai-cad-services` (non-functional
display-card concept only), `micro-saas-validation` (local formatter prototype, not a live subscription),
and `ai-education-services` (original adult workshop, not certification). Each has a separate goal,
recommendation and five-item starter-kit checklist. Existing catalog ordering and progress IDs are retained.

The tutorial registry's `serviceKitId` connects each service path to its kit and the shared proposal
builder/results tracker. These tools do not prefill outcomes or grant client/engineering approval.
Lesson instructions and downloads remain English with visible notices; catalog, checklist and hub copy
support French, German and Spanish. No paid AI is needed; CAD commercial-use licensing must be verified
before actual client work, and a paper alternative is clearly not a CAD deliverable.

**For this expansion, run the regenerated `supabase/seed.sql` before merge/deployment. No new migration
is required.** The seed adds four goals, paths and kits plus recommendations. The existing feedback
function recognises the new lesson IDs once the paths are seeded.

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

### Pilot Test & Results Tracker

`/business-launchpad/results-tracker` records up to 20 test cases (input, expected and actual results),
original outcomes, corrections and dated retests. The seven optional workshop plans include the six
tutorial events and a connector failure/retry check, with no fabricated outcomes. Replacing/removing
cases requires confirmation. Original and retest outcomes remain separately visible; this editable
worksheet is not an immutable audit log. A pass lacking name/input/expected/actual evidence counts as
pending; a retest also requires evidence notes. No automated test execution or production integration.

Metrics use one observed sample: baseline manual minutes minus processing and additional review/correction
minutes. Negative net time is retained (more work, not savings). Runs must be positive integers, other
inputs use the shared bounded hundredths parser (comma/point, up to two places), and blanks remain unknown.
Per-run time and EUR costs require a sample count; there is no monthly extrapolation, profit or ROI.
The user explicitly chooses continue/revise/stop, records reasons and next actions; unresolved tests or
missing context/metrics keep an incomplete-evidence notice. No decision grants deployment approval.

The report updates with current inputs and includes original results, retests, all metrics, costs, decision
and unknowns. Text download and scoped multi-page printing exclude the controls, not report evidence.
Report headings, UI and optional workshop plans support en/fr/de/es; user-entered text is not translated.
Save/Load/Delete use `desofec:pilot-results:v1` independently of the proposal. Saving/loading is explicit,
local only, not app-encrypted or synced; load validates schema and asks before replacing unsaved work.
Storage/download errors are visible and keep current work. Do not enter personal/confidential client data.
**No seed or migration is required for the tracker.**

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
