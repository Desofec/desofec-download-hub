# Desofec AI Studio — Next.js app

Next.js (App Router, Cache Components) version of Desofec AI Studio. It reads the catalog (goals, tools, learning
paths, starter packs, recommendations) from Supabase when configured, and falls back to the bundled JSON in
`content/` otherwise, so it runs with no backend.

The original static site files in the repository root are no longer deployed. GitHub Pages now publishes only
`legacy-redirect/`, which sends visitors of the old `github.io` address to https://www.desofec.com.

The canonical production origin is `https://www.desofec.com`. Metadata, structured
data, sitemap URLs and the robots sitemap declaration use this origin. In Vercel,
keep `www.desofec.com` serving the production app and configure `desofec.com` to
redirect to it, preserving paths and queries; never redirect both domains to each
other. Domain/DNS settings are managed outside this repository.
Set the production `NEXT_PUBLIC_SITE_URL` to `https://www.desofec.com` and redeploy
so newsletter links use the same origin; explicit local/preview overrides remain
supported. Email addresses still use `@desofec.com`, not `@www.desofec.com`.
Submit `https://www.desofec.com/sitemap.xml` in Search Console after deployment.
These settings help consolidate URLs but do not guarantee Google indexing.

The homepage highlights four editorially selected practice tutorials with
translated learning outcomes. These are not popularity or search-ranking claims.
Its hero focuses on starting, browsing tutorials and resuming learning; tool,
website-challenge, launchpad and AI-update links remain in the discovery section.
Tutorial links reuse the existing registry and create no new progress records.
The first six goals are visible initially; the remaining goals are available in an
expandable section. The Business Launchpad prioritises starting, choosing a service
and opening device projects, with the other existing links in an expandable section.
The home continuation card links to device projects as well as learning progress.
Tutorial certificates identify checklist completion as self-recorded, not an
independently assessed or accredited qualification.
The header uses a scrollable compact menu on tablets and smaller laptops; Escape
closes it and returns keyboard focus to the menu button. On medium desktop widths,
the duplicate header call to action is hidden while the Start here link remains.

Privacy and Terms provide French, German and Spanish translations on their
individual pages, with the original English available in an expandable section.
The translations are AI-assisted and have not received native-speaker or legal
review. Tests pin each translation to its English source: after editing English
legal content, review all three translations against it and update their
`sourceDigest` values. A matching digest does not replace human review. Legal
links are underlined, and links and the English-original control use high-contrast
text in every theme. Tool-page external links use their visible translated label
as their accessible name and announce when they open a new tab. Text accents use
a contrast-checked color separate from button backgrounds in lighter themes.

The tutorial directory offers editorial topic groups, combined topic/level/search
filters and a reset control. Search matches original and displayed translated
titles, descriptions and topic labels. Cards show the existing lesson introduction
(or the learning-path description for older tutorials), translated in French,
German and Spanish. English-only lesson instructions remain disclosed.
Topic assignments live in `lib/tutorial-directory.ts`; new tutorial
IDs must be assigned at least one topic. Filters are temporary and do not modify
progress or persist queries.
Card headings use full tutorial translations when available and the UI phrase book
otherwise; fallback title translations are also included in search. Translating a
directory heading does not imply that its lesson body is translated.
The tools directory renders browsable tool links while its interactive search and
comparison load; without JavaScript, those controls and saved-tool buttons are unavailable.

## Run locally

```bash
cd web
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

The app is installable on supported browsers. Use the browser's **Install app** button
when available, or its menu option. The service worker caches visited pages and app assets
and keeps offline copies of starter pack downloads. Downloads revalidate through the network
when online and use a cached copy if the network fails; an online error response is not
replaced with a cached success. The existing cache is retained during this worker update.
The offline page appears when a page has not been cached yet.

The `Web checks` GitHub Actions workflow runs content tests, catalog validation, lint and
the production build on pull requests using Node 22. It requires no Supabase credentials
or deployment permissions; repository settings determine whether the check is required.

## Reviewed AI updates

`/ai-updates` reads reviewed editions from `content/ai-digests.json`. Drafts are
never rendered publicly; publication requires a source review, publication date,
nonempty stories and a merged/deployed change. Source links, limitations and a
fictional practice activity accompany each story. The first entry is an empty
draft awaiting source verification. No twice-weekly scheduler, AI API, automatic
publication or digest emails are enabled. See
[`docs/ai-digest-editorial.md`](../docs/ai-digest-editorial.md) for owner review,
corrections and future automation instructions. No Supabase setup is needed.

## Practice project feedback guide

`/business-launchpad/feedback-guide` helps learners draft a bounded request and
turn actual feedback into a revision plan, linking back to the existing project
workspace and review centre. It does not store, send, upload or automatically
apply text. The request and revision plan have separate previews and downloads;
neither claims client approval or independent verification. The blank worksheet
is maintained in `downloads/practice-feedback-worksheet.md` and copied to
`web/public/downloads` by `npm run sync-content`. No migration or seed update
is required. Edits are lost on reload/navigation; downloaded copies are separate.

## Connect Supabase

1. Create a Supabase project.
2. In the SQL editor, run the migrations in order through `0014_commerce_projects.sql`, including `0011_pilot_projects.sql` for owner-private snapshots, then run `supabase/seed.sql`.
   The migrations are safe to re-run; the seed upserts. Apply the video migration and regenerated seed before deploying the business-video path.
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

### AI-powered commerce and logistics learning

Three platform-neutral paths share the `build-ai-commerce` goal:
`ai-online-retail`, `ai-marketplace-model` and `ai-logistics-services`.
Each has six lessons and links to the downloadable `ai-commerce-services-kit`.
They teach retail, multi-vendor marketplace and logistics business models, not
Amazon account setup. AI is optional and assists drafts, explanations and review;
fictional worksheets supply independently checkable costs, inventory, commission,
reservation and exception exercises. No storefront, payments, seller onboarding,
warehouse operation, shipment, model API or external integration is activated.
These courses support the Pilot Project Workspace with service-specific guided
journeys, test plans, workbook starters, review checklists and case-study exports.

Commerce tutorials, catalog titles, descriptions, learning steps and kit checklists
support French, German and Spanish. The commerce kit download is available in English,
French, German and Spanish and follows the selected language. Tutorial, path and kit
progress reuse existing tracking; translations do not alter saved project evidence.
Run `npm run sync-content` after changing the source catalog or download.
For Supabase deployments, apply the **regenerated `supabase/seed.sql` before
deploying** so all three paths, their goal and kit exist, including for lesson
feedback validation. For commerce account snapshots, apply migration **0014 after
0013 before deploying**; it extends only the existing RPC allowlist and preserves
ownership, quotas and conflict checks. No seed change is needed for the guided
project extension if the commerce catalog is already seeded. Redeploy/refresh the
hour-cached catalog after seeding; bundled-only deployments need no SQL.
The catalog contains 35 paths and 51 tools: courses and worksheets
are not counted as additional software tools.

### Interactive commerce practice lab

`/business-launchpad/commerce-lab` offers retail, marketplace and logistics tracks.
The three commerce paths/tutorials link to the matching `?track=` view; the launchpad
and sitemap include the lab. Invalid/repeated track query values use retail.
Editable fictional tables calculate retail contribution, inventory flags and weekly
amounts; exact catalog fact checks and per-order rounded commissions; receipt
reconciliation, sequential whole-order reservations, quarantined returns and a
separate hypothetical logistics cost scenario. Blank inputs remain unresolved,
malformed values and duplicate IDs produce explicit errors, and receipt discrepancies
block the reservation run. Changing receiving or requests invalidates linked results.

Results and edits are in-memory only, cleared on reload. Downloaded UTF-8 text includes
source inputs, linked requests, calculated tables, unresolved issues, limitations and
an optional AI review prompt. No account saving, uploads, model calls, connector,
real stock changes, payments, labels, messages or shipments occur. Source/working
tables, outputs and validation are English with an explicit notice; navigation and
notices support French, German and Spanish. No migration/seed update is required,
and the catalog remains at 51 tools and 35 paths. The lab does not grant owner
approval.

The three commerce tracks can now create device projects through the existing
workspace. Save the brief/checklist explicitly; use the shared kit and linked lab,
then download selected fictional observations and manually save the text in the
project evidence workbook. The lab neither loads nor modifies project records and
does not upload files or auto-fill tests. Each service supplies five required,
distinct bracket-coded test plans including missing/duplicate data and unavailable
approval. Recorded failures/blocks remain visible in reviews, portfolios and case
studies; journey completion is a self-recorded practice milestone, not a passing
grade or real business approval. Project-specific instructions/checks/starters are
English with a notice; navigation follows the selected language. Existing save,
revision, quota, consent, deletion and optional owner-private snapshot behavior is
reused. Apply `0014_commerce_projects.sql` before enabling new account snapshots.

Commerce projects also include an optional validation/readiness worksheet for
demand observations, two sourced provider comparisons, a bounded per-order
contribution/break-even scenario, role-based operational checks and an explicit
human decision/next test. It is not a forecast, professional compliance review,
provider endorsement or launch approval. The worksheet saves as an optional,
validated field in the existing project snapshot; it introduces no table,
migration, background sync or external lookup. Explicit account-upload consent
includes its evidence, comparisons and scenario values. Form labels, validation
messages and report text are English with a notice; app navigation follows the
selected language.

The optional commerce pilot planner records a bounded question/method and sample,
proposed start/review dates, currency-specific maximum budget, measurable success
and stop thresholds, role/evidence assignments and exclusions. It is a planning
draft only: it does not execute activity, spend funds or approve launch. The
validated plan is another optional field in the existing private project snapshot,
covered by explicit account upload consent and the existing revision/quota limits;
no migration, seed update, provider lookup or background sync is added. Planner
labels, validation messages and report text are English with a notice; navigation
follows the selected language.

The optional commerce pilot results and learning review records aggregate sample
counts, observed success/stop values, actual spend, evidence limits, unexpected
findings and a human-recorded stop/revise/explore decision. Comparisons only
evaluate the entered aggregate values against the saved plan thresholds; they
never choose the decision or authorize further activity. A changed plan marks an
existing review as stale and requires an explicit new review. The validated review
is an optional field in the same private project snapshot and is disclosed in
account-upload consent; it collects no participant-level records and requires no
migration or seed update. Review labels, validation messages and report text are
English with a notice; navigation follows the selected language.

### Commerce tool guides

Six external tools support the commerce goal: Shopify (storefront), Sharetribe
(marketplace), Zoho Inventory (stock records), Shippo (shipping), Zendesk (support)
and Looker Studio (reporting). Tool detail pages link to three-step guides at
`/tutorials/<tool-id>-guide`, and each guide links back to its tool and the shared
commerce kit. They reuse local/account tutorial progress and appear in the tutorial
index/sitemap. Feedback is disabled for these non-path IDs. No new learning path,
connector, vendor account, model API or live workflow is created.

Each English guide includes provider references, setup/eligibility checks, a
document/spreadsheet-only alternative, an optional AI prompt, fictional checked
outputs, cost omissions and approval boundaries. Catalog descriptions/categories
and guide navigation support French, German and Spanish; the existing notice
identifies English-only lessons. External sites could not be resolved during
implementation, so these additions have **no description-review stamp**; references
are starting points, not verified live links, fee quotes or endorsements.
Check current provider documentation before registration, spending or actual use.

Apply the regenerated `supabase/seed.sql` before deploying to a Supabase-backed
site, then refresh/redeploy the hour-cached catalog so the count becomes 51.
Bundled-only deployments require no SQL; no schema migration is needed.

### Excel data cleaning and PDF-to-Excel services

The existing `ai-spreadsheets` path now supports private service projects and
`/business-launchpad/spreadsheet-lab`. Its six lesson IDs, four path progress indexes,
original five-order exercise, goal and kit IDs stay unchanged. Complete three exercises in
order within one project: seven-row data cleaning, five-row PDF transcription checking
and an incomplete EUR 21 report with one unresolved quantity. The lab offers a real fictional
one-page PDF, CSV exports, explicit exceptions, editable transcription checks and a
zero-baseline chart with a text table. It uses no uploads, model or OCR engine and saves
nothing automatically. CSV is data, not an XLSX workbook; external workbook checks require
actual user observations. Raw data and missing-versus-zero evidence are never silently discarded.

SHEET-1..7 plans, workbook starters, Review Centre self-checks, proposals and private handovers
reuse the existing project infrastructure. Unavailable real owner approval stays blocked.
Apply **0013 after 0012**, then the regenerated seed before deployment. The migration expands
only the RPC allowlist, preserves ownership/quotas/CAS and is repeatable; an unexpected prior
function definition fails explicitly rather than silently proceeding. French, German and
Spanish cover catalog/workflow UI; the extended lessons and downloads remain English.

### Small-business workflow automation

The existing `/paths/ai-automation-services` path is now **AI Workflow Automation for Small
Business**. Its URLs, six lesson IDs, pack progress indexes and original AUTO-1..9 enquiry
exercise remain unchanged. The tutorial and English download include appointment reminders and weekly
reports, and `/business-launchpad/automation-lab` offers three temporary, rules-only simulations.
The lab has no model, external connector, storage, automatic project evidence or message dispatch.
Download observations explicitly. Fixed UTC appointments do not simulate timezone/DST services.
Weekly reports use integer cents, preserve source revisions and label unresolved values incomplete.

New automation projects choose an immutable optional `automationScenario`:
`enquiries`, `appointments` or `weekly-report`. Omitted metadata means the original enquiry
project; other paths reject this field. Selection drives plans (APPT-1..6 or REPORT-1..6),
milestone evidence, workbook starters, review instructions and private handover. Plans start
pending with blank actual results. All missing real owner approval stays blocked.
The strict client parser preserves this field through part saves and opt-in account snapshots.
No migration is needed beyond 0012: the existing server retains the project JSON and path ID.
Run the regenerated `supabase/seed.sql` to update production catalog names/descriptions before
deployment; it updates existing records without new catalog IDs or ordering changes.

### Guided first project

`/business-launchpad/first-project` recommends AI Content Services for a first no-code, fictional
practice package. Goal selection links to the existing workspace with a preselected path; it does not
create a project or upload anything. All seven service paths have six-stage guided journeys and private
portfolios, with service-specific instructions, evidence and explicit scope boundaries.

Service projects (including existing ones and loaded account snapshots) show six sequential milestones
derived from **saved** project data: learn, practise, draft, test, review and handover. They reuse the
existing checklist and progress keys; automation scenario metadata is optional and backward-compatible. Learn/practise/handover are self-recorded
work, not proof of tutorial completion or file inspection. Draft requires a current generated proposal
and seven scope/review fields; automation, spreadsheets, micro-SaaS and education additionally require data handling,
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
| Appointment reminders | APPT-1 through APPT-6: UTC window, permission, duplicate versions, cancellation/rescheduling, retry, off switch, owner review | Fixed-UTC simulation; no real calendar or dispatch |
| Weekly business reports | REPORT-1 through REPORT-6: date filters, duplicates, exact subtotal/exceptions, revisions, safe retry, off switch, owner review | Fictional EUR 21 incomplete subtotal; no automatic distribution |
| CAD | CAD-1 through CAD-5: base dimensions, revision, reopened exports, method/licensing, required review | CAD or paper-only, explicitly not for manufacture |
| Micro-SaaS | SAAS-1 through SAAS-8: exact output, blank/40/41/markup/invalid status, observed demand, costs/launch gaps | Local toy; manual work cannot establish browser passes; no subscriptions |
| Education | EDU-1 through EDU-5: facts/key, rehearsal timing, accessible original materials, adult trial, independent review | Consenting-adult practice; no learner records or qualification claims |
| Business video | VIDEO-1 through VIDEO-7: facts, three measured exports, captions, permissions, revisions, costs, owner approval | Fictional 15-30-second 1080 x 1920 videos; no posting or automatic file inspection |
| Spreadsheets | SHEET-1 through SHEET-7: raw/duplicates, dates/blanks, PDF source cells, formulas, report/chart, reopened exports, owner approval | Fictional source checks; no OCR engine, financial certification or confidential uploads |

After **Reload project draft**, the results tool offers **Load required service test plans** for these
non-content services. Replacement requires confirmation, changes only current test cases, and never fills in
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

Existing journeys use migration 0011 for optional account snapshots. The business-video addition
requires migration 0012 and the regenerated seed. Device/account deletion and existing privacy controls are unchanged.

### AI Video Creation for Business

The public `/paths/ai-video-business` page uses **AI Video Creation for Business** as its title.
`/tutorials/ai-video-business` teaches **Create Short-Form Videos with AI for Business** in six
lessons. These descriptive names reflect researched AI-video search intent, not verified keyword
volumes, a popularity ranking or a search-position guarantee. Existing `ai-video-creation` URLs and
progress keys remain unchanged. The new goal `create-business-videos` links tools and kits back to the
path; home, Launchpad and the original video tutorial link to it. Public path/tutorial/recommendation
metadata has explicit canonicals and matching social titles; the existing sitemap discovers the new
catalog records and tutorial. Private project routes remain noindex.

The exercise uses three fictional Cedar Bakery videos: visit, products and counter collection.
Each actual export is 15-30 seconds inclusive and 1080 x 1920; this is the exercise specification,
not universal platform policy. Original text-slide videos are a valid alternative to generated clips.
Storyboard-only work cannot establish an export pass. Record actual phone/sound-off checks,
caption corrections, permissions, v1/v2 history and unresolved owner approval. The workbook starter
and seven manual review checks support text records only: no video upload, generation, hosting or
inspection. The proposal requires timeline and data handling as well as shared scope/review fields.
All VIDEO plans start pending with empty actual evidence; a fictional owner approval stays blocked.
Saved milestones indicate recorded work, not passing tests or permission to publish.

**Deployment:** apply `0012_video_business_projects.sql` after `0011`, then the regenerated
`supabase/seed.sql`, before deploying. Migration 0012 only extends the account RPC's accepted paths;
owner isolation, locking, quotas, document limits and compare-and-swap remain unchanged. Reload all
app tabs after deployment; older app versions cannot read business-video projects. The six business-video
lessons and downloadable kit are available in English, French, German and Spanish. Catalog, journey,
workbook and review UI also support French, German and Spanish. Optional external tools may charge for
credits, exports or licensed assets.
### AI Video Creation Kit translations

The original `/tutorials/ai-video-creation` course already supports French, German and
Spanish lesson translations. Its separate `ai-video-creation-kit` download now follows
the selected language too, with complete French, German and Spanish copies alongside
the unchanged English download. The localized worksheets retain the 30-second,
three-scene exercise, asset permission checks, accessibility review and current
platform-format and AI-disclosure checks. This is separate from the AI Video Creation
for Business path and its business-video kit.

### Download language routing and freshness

Every starter-pack download button — catalog cards on the home, starter-pack, path,
results and tool pages, plus the kit detail page — uses `StarterPackDownload`, so the six
translated kits (`ai-content-services-kit`, `ai-automation-services-kit`,
`ai-spreadsheets-kit`, `ai-commerce-services-kit`, `ai-video-business-kit` and
`ai-video-creation-kit`) download in the selected language. Other kits stay English and
are labelled “(English)” on cards and “currently available in English only” on detail
pages when another language is selected. The tools search matches both English and the
translated text shown on cards, ignoring accents. The service worker fetches
`/downloads/` files from the network first and falls back to the cached copy offline, so
updated worksheets are revalidated rather than served directly from the service-worker
cache. `npm run test:content` includes `scripts/web-app-reliability.test.mjs` and
`scripts/service-worker.test.mjs` for these behaviours.

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

`/business-launchpad/review-centre?project=<uuid>` is private/noindex and supports all six
service paths with distinct manual review checks. Reload saved project and reviews, select a
workbook item/revision, then record observations for service-specific risk areas: content claims,
automation event/failure safety, CAD dimensions/exports, prototype boundaries or education facts,
timing and privacy, or video scripts/exports/captions/permissions. Every non-pending check needs observations; a correction status needs a task.
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

Migration 0011 retains optional review JSON; business-video account projects additionally need migration 0012.
Account upload consent explicitly includes copied review text. Reload all tabs after deployment;
older app versions must not edit review-bearing projects because they do not retain this field.

### Start Here and project completion dashboard

`/start-here` recommends the existing fictional content-service journey, with alternatives via
the first-project chooser. Home and header primary entry points lead here; `/onboarding` remains
available for other learning goals. The same read-only device-project dashboard appears on
`/my-progress`. It reuses `serviceProjectJourney`, not a new completion scheme or saved state.
Six sequential milestone counts describe recorded practice, not verified skills. Failed, blocked,
pending and stop/revise decisions remain visible even when all milestones are recorded.
Case-study text status does not imply evidence verification or sharing approval.

Project reads happen only after client hydration and never upload or load cloud snapshots.
Refresh explicitly, or on browser focus/pageshow/cross-tab storage changes. Storage errors are
shown rather than treated as zero projects. Account snapshots are explicitly loaded in the workspace.
No new storage keys, project fields, analytics events, migration or seed are required.
The collapsed lesson/kit panel reuses `ProgressDashboard` and its existing signed-in progress rules,
separate from private-project milestones. Existing progress IDs, records and learning routes remain.

### Freelance client discovery and project scoping

The `freelance-client-discovery` learning path has six stable tutorial tasks and a separate
five-item kit checklist. It is shared preparation for the seven service project types, not
an eighth project type. The public `/business-launchpad/client-discovery-lab` uses fixed fictional
answers and temporary React state only; no AI conversation, outreach, storage write or upload.
The private/noindex `/business-launchpad/client-discovery?project=<uuid>` requires explicit reload.

Optional `discovery` JSON stores eight brief fields, six tri-state fit checks, evidence notes
and five proposed-change fields, each text capped at 2,000 characters. Legacy projects omit it.
Part saves preserve other project fields and reject stale edits/deleted projects under the
existing Web Lock. No fit choice completes milestones or test evidence. Any No/Unknown,
missing brief text or empty evidence keeps fit paused; even a complete self-check only permits
continuing scoping, not accepting work. Changes always remain proposed, not accepted.

The proposal tool's **Start from saved discovery** requires reload and replacement confirmation.
It reads current saved discovery and copies scope fields only, leaves all money blank and clears
generated text/source. It does not save or apply proposed changes. Unknowns and fit decisions
remain in discovery and must be reviewed alongside the proposal. Explicit proposal saves retain
existing part-level conflict checks. Discovery exports require sensitive-data acknowledgement
and reject changed discovery; unrelated costs, results, proposals, workbook and reviews are omitted.

Run the regenerated seed for the new goal/path/kit. No new SQL migration is required: account RPCs
already retain optional project JSON. Existing spreadsheet projects still require migration 0013.
Account consent covers discovery. Device/account/downloaded copies and imported proposal text
must be deleted separately. Reload old tabs after deployment; older app versions cannot retain
the new field when editing snapshots. Lessons and worksheet are English; lab/interface and catalog
have French, German and Spanish translations.

### Freelance portfolio and case study builder

The public `/business-launchpad/freelance-portfolio` landing page explains the workflow.
From any saved service project, choose **Build a freelance case study**, then explicitly
reload on the private/noindex `/business-launchpad/case-study-builder?project=<uuid>` page.
Write the problem, contribution, observed outcome and limitations. The optional brief starter
copies saved context only: outcome stays blank, and no test is automatically selected.

The optional, strictly validated `caseStudy` project part retains five text fields (120 characters
for title, 2,000 for each narrative field) and up to twenty unique selected test IDs.
Explicit part saves preserve other project parts and reject conflicting edits or deleted projects.
Previews and exports use saved text and saved source tests, not unsaved edits. Export checks the
current device project against the reviewed snapshot and rejects changed evidence until reloaded.
Selected evidence includes original/effective outcomes, corrections and retests; unsupported passes
remain pending. Missing selected tests remain flagged. Review-check counts include archived records,
keep needs-correction statuses visible even when a task is marked addressed, and omit raw review text.
Whole-project counts, required-code gaps,
decision and journey state cannot be hidden by deselecting tests. All exports are fictional practice,
not verified client work, certification or financial/employment guarantees.

Text downloads and browser **Print / Save as PDF** require sensitive-data acknowledgement.
A print-only body portal excludes navigation, controls, account UI and unrelated drafts; React
renders user text without HTML interpretation. PDF creation is the browser's print feature, not an
app PDF conversion service. Disable browser headers/footers to omit the URL. No public hosting,
automatic sharing, AI generation, file upload or new dependency is introduced.

No new migration or seed is needed for this feature: the existing project RPC retains optional JSON,
and spreadsheet account projects still require migrations through 0013. Account consent includes
saved case studies. Device removal leaves account and downloaded/printed copies unchanged.
Reload old tabs after deployment; older app versions must not edit case-study-bearing snapshots.

### Project storage and account snapshots

`/business-launchpad/projects` creates up to ten device projects from the supported service paths.
Each owns a brief, independent five-item project checklist, optional proposal/results drafts and a
next-action prompt derived only from saved evidence. Project checklists do not complete tutorial or kit
progress. The path is fixed at creation; start a separate project for another track.

Open a project tool, press **Reload project draft**, then optionally **Start from project brief**.
The latter copies only context, never results/approvals or fees. Save explicitly; standalone drafts
and other projects are not overwritten. Changing a brief does not rewrite existing tool drafts.
Summaries use saved data, omit financial fields/full drafts, and are internal practice records, not
proof of customer approval, engineering readiness, accreditation or income. Review text before sharing.

The workspace can explicitly download a versioned JSON backup of all saved device projects.
It contains full saved drafts, costs, test results, workbook revisions and reviews, so it is
private, unencrypted and must be stored securely. Unsaved changes, standalone tool drafts,
learning progress, account snapshots and account metadata are not included. Selecting a file
only validates and previews it; after confirmation, restore creates new device copies with new
project IDs and no account association. Existing projects are never overwritten, and text
links are not rewritten. Backup is refused if saved records contain fields this version cannot
preserve. Imports fail before writing if the file is invalid, contains unsupported fields, or
exceeds the ten-project device limit. Device writes use the existing Web Lock; if a
write fails, new copies are rolled back when possible and any incomplete cleanup is reported.
The project summary download remains a separate, deliberately limited export.

**Deployment: apply `supabase/migrations/0011_pilot_projects.sql`, then
`0012_video_business_projects.sql` and the regenerated `supabase/seed.sql` before deploying.**
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
with auth fixtures and migrations 0011/0012 applied, `supabase/tests/pilot_projects.sql` checks ownership,
permissions, version conflicts, limits, deletion and cascade behavior; its fixtures roll back.

The Launchpad lists six service paths, including the business-video journey above. The four earlier additions have six lessons each:
`ai-content-services` (fictional bakery package and revisions), `ai-cad-services` (non-functional
display-card concept only), `micro-saas-validation` (local formatter prototype, not a live subscription),
and `ai-education-services` (original adult workshop, not certification). Each has a separate goal,
recommendation and five-item starter-kit checklist. Existing catalog ordering and progress IDs are retained.

The tutorial registry's `serviceKitId` connects each service path to its kit and the shared proposal
builder/results tracker. These tools do not prefill outcomes or grant client/engineering approval.
The content-service, CAD concept, micro-SaaS validation and AI education courses have
complete French, German and Spanish translations, including all six steps, worksheet
labels/text, checks and optional AI prompts. The modules are
`lib/translations/content-services.ts`, `lib/translations/cad-services.ts`,
`lib/translations/micro-saas.ts` and `lib/translations/education-services.ts`.
Stable step IDs and progress storage keys are unchanged.
Translation worksheet labels use the optional `StepTranslation.file` field; other lessons retain
their source filenames when no translation supplies one. CAD translations preserve millimetre
dimensions, geometric checks, license cautions and the `CONCEPT ONLY - NOT FOR MANUFACTURE` boundary.
Other courses' lesson instructions and service-kit downloads remain English with visible notices,
except for the translated courses and kits described here. Catalog, checklist and hub copy
support French, German and Spanish. No migration or seed update is needed for this translation.
No paid AI is needed; CAD commercial-use licensing must be verified
before actual client work, and a paper alternative is clearly not a CAD deliverable.
The Micro-SaaS prototype remains local-only, with no network or storage, and the
education workshop uses original adult-learning materials without personal learner
records, accreditation or guaranteed outcomes.

The bakery workbook's **Use this service text starter** loads a blank guided worksheet in
English, French, German or Spanish after confirmation. It includes the fictional fact sheet,
three 40-60-word post sections with manual word-count records, four named FAQ sections,
claim/asset ledgers, v1/v2 revision prompts and explicit blocked owner approval. These are
prompts, not completed evidence. Guidance and review checks follow the selected language;
existing titles, drafts, linked tests, review observations and retained revisions stay unchanged
when switching languages or loading the starter. Loading replaces only the unsaved form;
an explicit save appends a revision without rewriting history. No migration or seed update is
required. The downloadable service kit is a separate document with localized French, German and
Spanish variants. Its detail-page download button follows the selected language; English and all
other kits retain their existing files. The kit and variants are checked in both `downloads/` and
`web/public/downloads/`; this does not localize other kits or change saved project content.

**Run the regenerated `supabase/seed.sql` before deployment, after migrations 0011 and 0012.**
The seed includes service goals, paths, kits and recommendations. The existing feedback
function recognises the new lesson IDs once the paths are seeded.

`/business-launchpad` starts with `/tutorials/ai-automation-services`: six lessons covering discovery,
bounded scope, a six-event fictional enquiry demo, costs, a draft offer and handover. The practice workflow
prepares drafts for human review and never requires real customer data, paid tools or automatic sending.
The tutorial has complete French, German and Spanish translations in
`lib/translations/automation-services.ts`: all six lessons, worksheet labels/text, checks and
optional AI prompts. Column identifiers (`event_id`, `message`, `status`, `draft`, `reviewer`),
status codes (`QUEUED`, `REVIEW`, `INVALID`, `DUPLICATE`) and AUTO/APPT/REPORT plan codes
stay unchanged to match the lab and saved projects; their meaning is explained in each language.
The hub, catalog, checklist UI and the English/French/German/Spanish automation kit are available.
The kit download button follows the selected language for English, French, German and Spanish;
other kits retain their existing files and language behavior. The translated source documents and public
files are kept in sync and covered by content tests. The lab sample data/results and
private workbook evidence content remain English with their existing notices; the lesson
translation does not translate these separate surfaces. Costs are illustrative, not market
prices or earnings promises. Step IDs, storage keys, progress and no-send behavior are unchanged.
No migration or seed update is needed for this translation.

The downloadable AI Spreadsheets kit has French, German and Spanish versions. Its detail-page download
follows the selected language while preserving the original formulas, sample values, SHEET-1 through
SHEET-7 checks, unresolved-value distinctions, and private-project safeguards. Source and public files
are kept in sync and covered by content tests; other starter kits are unchanged.

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
`../supabase/seed.sql`. Commit the results. A Supabase-backed deployment also needs a separately reviewed
catalog update and cache refresh; the generated seed includes whole-catalog operations, so do not apply it
blindly to production. Review the intended rows and preserve existing learner data.

`data/tool-reviews.json` records dated, AI-assisted checks of English descriptions against official
documentation. These do not verify translated text, every feature, prices or live links; all can change.
Tools without a matching review display that no review is recorded. Entries bind the exact displayed name,
description and tool URL; validation rejects changes until the review is updated or removed, and the
runtime does not attach a stale review to a Supabase row. The bundled metadata is joined in both catalog
loaders, so the review labels require no database column.

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

- Unknown `/results/[goal]` and `/paths/[id]` URLs show a noindexed 404 page. Because streaming
  can affect the HTTP status, verify the deployed response instead of assuming a fixed status.
On iPhone/iPad, use Safari's **Share → Add to Home Screen**. PWA installation and service workers require HTTPS (Vercel provides it; localhost is also treated as secure during development).
