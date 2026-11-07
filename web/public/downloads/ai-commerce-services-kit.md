# AI-Powered Commerce and Logistics Kit

Three platform-neutral learning tracks. No specific marketplace is required.
All businesses, orders and amounts below are fictional practice data. AI is optional:
use a document and spreadsheet, check the calculations yourself, and keep drafts private.
Each tutorial takes about two hours for worksheets; research, feedback and setup take longer.
The lessons and this download are currently English; the surrounding catalog supports
French, German and Spanish.

## Choose your business model

| Track | Model | Practice deliverable |
|---|---|---|
| Online retail | Sell your own product offer to customers | Listing, inventory worksheet and weekly report |
| Multi-vendor marketplace | Connect independent sellers with buyers | Seller checklist, catalog and commission ledger |
| Logistics services | Handle client-owned goods and order records | Receiving, reservation and exception worksheets |

Tutorials:
- https://www.desofec.com/tutorials/ai-online-retail
- https://www.desofec.com/tutorials/ai-marketplace-model
- https://www.desofec.com/tutorials/ai-logistics-services

Interactive practice: https://www.desofec.com/business-launchpad/commerce-lab

Choose a retail, marketplace or logistics track, edit fictional tables and calculate.
Blank values stay unresolved; invalid values and duplicate identifiers need correction.
Receipt discrepancies block reservations, and changing linked inputs clears old results.
Download your source/result worksheet explicitly: edits and results disappear on reload.
The lab calls no AI, connects no accounts and performs no live business actions.
Use its optional AI prompt only with fictional or approved non-confidential material.

## Guided private project journey

Create one device project for your chosen track at
https://www.desofec.com/business-launchpad/projects and explicitly save its brief.
Use the lab link in the saved project, download selected observations, then reload
the project evidence workbook and manually save fictional source, output and
exception text as a versioned draft. No file upload or automatic test pass occurs.
Save a bounded proposal and load the required service test plans in the results
tracker; record actual observations for each bracketed code. Missing real approval
is BLOCKED. Review revisions and unresolved issues, then export a clearly labelled
fictional practice portfolio or case study. Device storage is not encrypted; anyone
using the browser profile can see it. Account snapshots are optional and require
sign-in, explicit consent and the current database migration; no background upload.

Start with one track. Record the country, target customer, responsibilities and actual
discovery evidence. No interviews means **demand UNVALIDATED**. A worksheet or mock-up
is not a live store, payment system, warehouse or carrier integration.

## Optional tools and practical guides

Choose tools for your track; you do not need all six, a paid account or an integration.
Each guide provides a document/spreadsheet alternative, an optional AI prompt, checked
practice outputs, costs to investigate and approval boundaries.

| Tool | Role | Guide |
|---|---|---|
| Shopify | Hosted online storefront | https://www.desofec.com/tutorials/shopify-guide |
| Sharetribe | Multi-vendor marketplace exploration | https://www.desofec.com/tutorials/sharetribe-guide |
| Zoho Inventory | Stock and order records | https://www.desofec.com/tutorials/zoho-inventory-guide |
| Shippo | Shipping and dispatch planning | https://www.desofec.com/tutorials/shippo-guide |
| Zendesk | Human-reviewed customer support | https://www.desofec.com/tutorials/zendesk-guide |
| Looker Studio | Reconciled reports and dashboards | https://www.desofec.com/tutorials/looker-studio-guide |

Provider documentation and pricing references are linked in each guide. External sites
could not be resolved during implementation; these are starting points, not live-verified
references or endorsements. Check current country eligibility, features, plans, renewal,
add-on/usage fees and data policies before registration or spending. No fixed vendor prices
are quoted. Optional AI is not assumed included in a provider plan.

## Shared setup and AI rules

1. Create a private practice folder with Brief, Source, Working, Checks and Handover.
2. Choose a spreadsheet and optionally an AI assistant. Paid tools are not required.
3. Compare future platforms by capabilities, country eligibility, total costs, access,
   exports, accessibility and maintenance using their current official documentation.
   Do not assume menus, fees or requirements are the same across providers.
4. For any real service, the owner completes registration/identity/payment verification
   directly with the authorised provider. Use least-privilege access, not shared passwords.
5. Verify applicable product, consumer, tax, privacy, payment and physical-safety
   requirements with appropriate sources and advisers before any live operation.
6. Never send customer addresses, identity documents, bank/card details, passwords,
   confidential stock records or private complaints to an AI tool.

Reusable prompt:

> Use only this fictional or approved non-confidential source: [source]. Help with
> [specific draft or calculation explanation]. Preserve identifiers and unknowns.
> Return the result, a fact/evidence ledger, assumptions and questions for human review.
> Do not invent facts, current fees, demand, credentials, approval, delivery, income or
> compliance. No automatic sending, publishing, orders, refunds or payments.

AI explains and drafts; formulas, source checks and human reviewers establish correctness.
No copied competitor text, fake reviews, misleading claims or invented endorsements.

## Track A: online retail

### Brief and listing exercise

Fictional Cedar Stationery, SKU NB-A: pack of two A5 notebooks, 80 ruled pages each,
paper cover. Supplier, brand, identifiers, certifications and actual demand are unknown.

Draft a title, three feature bullets and a short description using only those facts.
Keep v1 and revise once to move pack quantity earlier. Do not publish.

| Claim | Evidence | Decision |
|---|---|---|
| Two notebooks | Approved pack quantity | KEEP |
| 80 ruled pages each | Approved fact | KEEP |
| Waterproof | None | REMOVE |
| Recycled paper | None | REMOVE |
| Brand or product identifier | Unknown | TO CONFIRM |

Compare self-fulfillment, a provider and supplier-direct fulfillment by quality,
reliability, stock visibility, delivery/returns responsibilities and verified costs.
Outsourcing does not remove retailer obligations.

### Cost exercise

Invented USD allowances, **not vendor quotes**:

```text
Price 20 - product 6 - channel/payment 3 - packing/delivery 4
         - inbound 1 - returns 1 = contribution 5
Contribution/price = 5/20 = 25%
```

Storage, ads, overhead and taxes are excluded/unknown. Contribution is not net profit.
For real costs, record source/date and leave missing values unresolved, not zero.

### Inventory exercise

Copy into a spreadsheet; retain the source.

```csv
sku,sold_14d,usable_stock,confirmed_inbound,lead_days,buffer
NB-A,28,18,0,10,6
PN-B,14,30,0,7,4
```

With columns A:F, after validating numeric non-negative inputs:

```text
G2 =B2/14
H2 =G2*E2+F2
I2 =C2+D2
J2 =IF(I2<=H2,"REVIEW","HOLD")
```

Formula separators vary by locale. Missing lead time means TO CONFIRM: do not run a
formula that treats blank as zero. Copy checked formulas to row 3.

| SKU | Daily average | Threshold | Position | Flag |
|---|---:|---:|---:|---|
| NB-A | 2 | 26 | 18 | REVIEW |
| PN-B | 1 | 11 | 30 | HOLD |

NB-A cover is 18/2 = 9 days. REVIEW is not an order quantity or permission to buy.
Real planning also needs reservations, seasonality, minimum orders and cash constraints.

### Weekly report and customer support

Separate period: 2030-01-07 through 2030-01-13 inclusive, USD:

```csv
sku,units,price,refund_amount
NB-A,10,20,20
PN-B,5,10,0
```

Gross = 250; refunds = 20; after refunds = 230. Not profit or cash received:
fees, taxes and other adjustments are omitted. Prior-period data is absent, so growth
is UNKNOWN. Label the 14-day inventory sample separately.

Ask AI for five sentences covering dates, figures, inventory flags, limitations and
next questions; verify every number. Draft a missing-parcel acknowledgement without
promising a refund/delivery date or sending automatically. Actual support uses approved
order records, policies and human review.

Acceptance: supported copy, 5/25%, 26/11, 9-day cover, 250/20/230, reopened files.

## Track B: multi-vendor marketplace

### Model, platform and onboarding

Fictional Cedar Market connects S1 (notebooks) and S2 (pens) with buyers.
Define who sells, fulfills, handles returns, sets prices, receives funds and pays taxes.
A commission model does not itself settle these responsibilities.

Compare hosted marketplaces, multi-vendor store features and custom builds.
Check real seller verification, permitted products, stock updates, fees, exports,
permissions and country/payment-provider eligibility before launch. Use paper screens
or test mode only. Never collect card details or assume permission to hold funds.

Seller checklist: seller ID, approved products, fact/image evidence, fulfillment owner,
returns owner, fee agreement, access, reviewer, unresolved items. Fictional seller
profiles do not establish actual verification.

### Catalog and matching exercise

```text
S1/N1: two A5 ruled notebooks, 80 pages each
S2/P1: three black-ink pens
Unknown: brand, certification, delivery time, image permissions
```

Keep seller/SKU identity and source facts. AI may normalise wording, not invent attributes.
Reject recycled notebooks and refillable pens. Test:

- A5 notebooks -> S1/N1
- Black-ink pens -> S2/P1
- Waterproof notebook -> NO VERIFIED MATCH

Results are practice classification, not stock confirmation or endorsement.

### Commission exercise

Invented USD agreement: 10% commission on merchandise amount after refunds.
Actual contracts and refund treatment may differ.

```csv
order,seller,gross,refund
O1,S1,100,0
O2,S2,80,20
O3,S1,50,50
```

| Order | Retained | Commission | Seller allocation |
|---|---:|---:|---:|
| O1 | 100 | 10 | 90 |
| O2 | 60 | 6 | 54 |
| O3 | 0 | 0 | 0 |
| Total | 160 | 16 | 144 |

Gross 230 - refunds 70 = retained 160 = commission 16 + allocations 144.
S1 allocation 90; S2 54. Not actual payouts or operator profit: provider fees,
taxes, chargebacks, reserves and timing are omitted.

Repeated O2 -> ERROR/REVIEW, not another sale. Missing refund -> UNRESOLVED, not zero.
Ask AI to explain; verify with formulas and by hand. No money moves.

### Support and moderation

Fictional case M1: damaged parcel, outcome UNKNOWN. Draft acknowledgement and route
to the authorised operator/seller reviewer. Do not blame, issue refunds or promise
deadlines. Record evidence, reason, responsible reviewer and appeal route.
Never punish a seller or infer fraud solely from AI classification.

Acceptance: seller identities, three query outcomes, 230/70/160/16/144,
90/54 allocations, duplicate rejection, human escalation, reopened files.

## Track C: logistics services

### Scope and receiving

Client C1 owns ordinary notebooks and pens. Practise record handling only.
Actual facilities, handling, worker safety, insurance and contracts require appropriate
review. Exclude hazardous, regulated, temperature-controlled and safety-critical goods.

```csv
sku,expected,usable,quarantined,total,location
NB-A,30,28,2,30,A1
PN-B,20,20,0,20,B1
```

NB-A total 30 = 28 usable + 2 damaged/quarantined. PN-B usable 20.
Unknown count/condition stays REVIEW. AI cannot inspect goods or approve release/disposal.

### Sequential reservation exercise

Start usable NB-A 28, PN-B 20. Reserve whole orders only; no partial-fill/backorder.

```text
L1: NB-A 5 and PN-B 3 -> RESERVED; available NB-A 23, PN-B 17
L2: NB-A 25 -> HOLD, shortage 2; reserve nothing
L3: PN-B 4 -> RESERVED; available NB-A 23, PN-B 13
```

Final available 23/13; reserved 5/7. Repeat L1 -> DUPLICATE/REVIEW.
Quarantined stock is excluded. Reservations are not physical picks or shipments.

### Dispatch and returns

Checklist: approved order, actual pick/pack checks, verified destination in an authorised
system, carrier eligibility, delivery terms and carrier-acceptance evidence.
Planned pickup or a generated tracking number is not dispatch/delivery proof.
No shipments or customer addresses are processed in this exercise.

R1 is one NB-A returned from an earlier completed order outside this simulation.
Quarantine pending inspection; do not restock or change available 23/13.
Disposition/refund is a separate authorised decision.

AI may draft a truthful review-status message. Human review of actual records is required;
do not invent tracking, delivery, inspection or refund approval.

### Cost and exception report

Invented USD: fee 8 - labour allowance 3 - packaging 1 - overhead allowance 2
= contribution 2/order, 25% of fee.

For **10 hypothetical processed orders**, fees 80 - allowances 60 = contribution 20.
Shipping, insurance, taxes and other costs are excluded/unknown. Not market rates,
complete profit or actual revenue.

Keep this cost scenario separate from the reservation exercise: two reserved,
one held, zero physical shipments, one duplicate test rejected, one returned unit
pending inspection. No actual savings or delivery success established.

Acceptance: usable 28/20, available 23/13, reserved 5/7, L2 held, duplicate rejected,
R1 quarantined, zero shipments, 2/25% and hypothetical 80/60/20.

## Handover and bounded service offer

Save source, working worksheets, claim/exception ledgers, prompts, v1/v2, check records
and a runbook. Reopen actual files; CSV contains data, not workbook formulas/sheets.
Do not claim external file checks until you performed them.

```text
Track:
Fictional practice deliverables:
Actual check / expected result / observation / unresolved issue:
Scope and exclusions:
One revision round:
Actual time and internal tool costs:
Proposed fee (separately chosen, not internal costs):
Approved data, least-privilege access, retention/deletion:
Responsible reviewer:
Real owner/client approval: BLOCKED - fictional practice
Demand: UNVALIDATED unless actual evidence recorded
Next evidence needed:
Decision: practise more / revise / stop / seek consenting discovery
```

No automatic publication, money handling, purchases, stock release, refunds or shipping.
No income, delivery, customer approval or compliance guarantees. Continue means more
practice/discovery, not a live launch. Keep portfolio material labelled FICTIONAL PRACTICE.
