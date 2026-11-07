import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const onlineRetailSteps: TutorialStep[] = [
  {
    id: 'retail-model-and-brief',
    title: 'Choose a small online retail model',
    explanation: [
      'An online retailer sells products to customers and remains responsible for its offer, fulfillment and customer support. It differs from a marketplace that connects independent sellers, and from a logistics provider that handles goods for other businesses. Practise with fictional Cedar Stationery: one notebook listing, two inventory rows and a weekly report. No purchases, seller account or paid AI are required.',
      'Before real work, ask consenting potential customers neutral questions about needs, existing alternatives and delivery expectations. Record actual evidence separately from guesses; no interviews means demand UNVALIDATED. Choose the country, product category, supplier and sales channel only after checking eligibility, product safety, taxes, consumer rights and relevant platform rules with appropriate sources/advisers.',
      'For a future store, compare hosted storefronts, existing marketplaces and a custom site by total costs, data/export options, accessibility and support. The owner registers and verifies the chosen service directly. Begin with a draft/test environment, approved product facts, a fulfillment plan and returns policy; do not accept payments or publish until reviewed. Never put passwords, identity documents or customer records into AI chat.'
    ],
    file: 'Fictional retail brief',
    code: 'Business: Cedar Stationery (fictional)\nSKU NB-A: pack of 2 notebooks; A5; 80 ruled pages each; paper cover\nUnknown: supplier, brand, certifications, product identifier, actual demand\nCountry / channel / verified requirements: TO CONFIRM\nDeliverables: listing draft + inventory worksheet + weekly report\nReviewer: business owner role; real approval NOT AVAILABLE\nExcluded: publishing, payments, purchases, ads and legal/tax advice',
    check: 'Your brief distinguishes retail from marketplace/logistics and keeps demand, supplier and legal requirements unvalidated until evidenced.',
    aiPrompt: 'Help me scope this fictional online retailer. Write five neutral customer discovery questions and compare hosted store, marketplace and custom-site options without inventing demand, prices or eligibility. List what requires owner or qualified review. Never ask for credentials: [brief].'
  },
  {
    id: 'retail-cost-and-fulfillment',
    title: 'Compare fulfillment and calculate contribution',
    explanation: [
      'Compare holding and dispatching stock yourself, using a fulfillment provider, and supplier-direct fulfillment. Verify supplier reliability, permissions, stock visibility, product quality, shipping promises and returns responsibilities; outsourcing does not remove the retailer’s obligations. AI can organise questions, not certify a supplier or guarantee delivery.',
      'Invented USD example: sale price 20, product cost 6, channel/payment allowance 3, packing/delivery allowance 4, inbound allowance 1 and returns allowance 1. Contribution is 20 - 6 - 3 - 4 - 1 - 1 = USD 5 per unit, or 25% of price. This is not net profit: storage, ads, overhead and taxes are excluded. The allowances are not vendor fee quotes.',
      'Compare each fulfillment option with independently sourced costs for the same price and quantity. Record source/date and leave unknowns TO CONFIRM rather than zero. Use a spreadsheet and verify by hand before asking AI to explain tradeoffs. Do not order inventory or change delivery promises automatically.'
    ],
    file: 'Illustrative cost worksheet (USD)',
    code: 'A1 Price | B1 20\nA2 Product | B2 6\nA3 Channel/payment allowance | B3 3\nA4 Packing/delivery allowance | B4 4\nA5 Inbound allowance | B5 1\nA6 Returns allowance | B6 1\nA7 Contribution | B7 =B1-SUM(B2:B6)\nA8 Contribution / price | B8 =B7/B1 (percent)\nExpected: USD 5; 25%\nAll amounts invented, not fee quotes.\nExcluded/unknown: storage, ads, overhead, taxes\nActual cost | source | checked date | unresolved items:',
    check: 'You reproduce USD 5 and 25%, identify excluded costs and distinguish contribution from net profit.',
    aiPrompt: 'Audit this fictional USD cost worksheet and show the subtraction and ratio. Compare self-fulfillment, a fulfillment provider and supplier-direct fulfillment as options, not recommendations. Treat missing costs as unresolved; do not invent supplier verification or fees: [worksheet].'
  },
  {
    id: 'retail-listing-and-ai',
    title: 'Draft factual product copy with AI',
    explanation: [
      'Draft a working title, three feature bullets and a short description using only the NB-A facts. A practice title is A5 Ruled Notebooks, 80 Pages Each, Pack of 2. Keep it in a private document or draft store, not a live listing. The owner must confirm identifiers, images, availability, delivery terms and applicable channel requirements.',
      'Ask AI to mark missing facts rather than complete them. Reject waterproof, recycled, eco-friendly and guaranteed productivity claims: the brief provides no evidence. Do not copy competitor copy, invent reviews or use unlicensed images. Product imagery must accurately represent the actual goods; generated illustrations are not evidence of product features.',
      'Build a claim/evidence/decision ledger and save v1/v2 after one controlled revision. Check readability, accessible image text, supported claims and current sales-channel rules yourself. Clear copy does not guarantee ranking, conversions or compliance; publication requires owner approval.'
    ],
    file: 'Listing and claim ledger',
    code: 'Title: A5 Ruled Notebooks, 80 Pages Each, Pack of 2\nThree bullets: quantity / size / ruled pages and cover\nDescription: factual summary only\nClaim | evidence | decision\n2 notebooks | approved pack quantity | KEEP\n80 ruled pages each | brief | KEEP\nWaterproof | no evidence | REMOVE\nRecycled paper | no evidence | REMOVE\nBrand / identifier | unknown | TO CONFIRM\nv1 -> v2: move quantity earlier; preserve facts\nStatus: DRAFT - OWNER REVIEW REQUIRED',
    check: 'Your title, three bullets and description use supported facts; the ledger rejects waterproof and recycled claims.',
    aiPrompt: 'Draft a title, three factual bullets and a short description from this fictional brief. Return a claim/evidence/decision ledger. Mark unknowns TO CONFIRM; reject unsupported claims, copied competitor text and invented reviews. Do not promise sales or compliance: [brief].'
  },
  {
    id: 'retail-inventory-planning',
    title: 'Check inventory thresholds before replenishment',
    explanation: [
      'Create columns SKU, sold units in 14 days, usable stock, confirmed inbound, lead days and safety buffer. Use NB-A: 28, 18, 0, 10, 6; PN-B: 14, 30, 0, 7, 4. These are aggregate fictional figures, not customer records. Keep original rows unchanged.',
      'Daily average = sold/14; planning threshold = average x lead days + buffer; simplified position = usable stock + confirmed inbound. NB-A gives 2/day, threshold 26, position 18: REVIEW; PN-B gives 1/day, threshold 11, position 30: HOLD. NB-A cover = 18/2 = 9 days. REVIEW is not an order quantity or permission to buy.',
      'Validate inputs before formulas: missing lead time means TO CONFIRM, not zero/HOLD. Real planning also needs reservations, seasonality, minimum orders, cash constraints and uncertainty. A 14-day average is not a reliable forecast. AI may explain flags and missing evidence; the owner approves replenishment.'
    ],
    file: 'Inventory worksheet',
    code: 'SKU | sold_14d | usable_stock | confirmed_inbound | lead_days | buffer\nNB-A | 28 | 18 | 0 | 10 | 6\nPN-B | 14 | 30 | 0 | 7 | 4\nColumns A:F; row 2:\nG2 =B2/14\nH2 =G2*E2+F2\nI2 =C2+D2\nJ2 =IF(I2<=H2,"REVIEW","HOLD")\nExpected NB-A: 2 | 26 | 18 | REVIEW\nExpected PN-B: 1 | 11 | 30 | HOLD\nNB-A cover: 9 days\nOnly copy formulas after checking numeric non-negative inputs.\nMissing lead time: TO CONFIRM. Separators may vary by locale.',
    check: 'You reproduce both thresholds and flags and 9-day cover; missing lead time remains unresolved.',
    aiPrompt: 'Audit these fictional rows with daily = sold/14, threshold = daily x lead + buffer, position = stock + inbound. Show both calculations. Flag missing/negative/nonnumeric data without replacing it with zero. Explain why REVIEW is not a purchase instruction: [rows].'
  },
  {
    id: 'retail-report-and-support',
    title: 'Create a checked report and support draft',
    explanation: [
      'For the separate seven-day period 2030-01-07 through 2030-01-13 inclusive, NB-A sold 10 at USD 20 with USD 20 refunded; PN-B sold 5 at USD 10 with no refunds. Gross merchandise amount = USD 250, refunds = USD 20, after refunds = USD 230. These amounts exclude fees, taxes and other adjustments: they are not profit or cash received.',
      'Ask AI for a five-sentence report with dates, reconciled figures, separately labelled inventory flags, limitations and next questions. Recalculate every number. No prior-period data means growth/trends UNKNOWN; one refund is not evidence of customer satisfaction.',
      'Draft a polite acknowledgement for a fictional missing parcel. Ask the owner to investigate through the approved order/support workflow. Do not promise a delivery date/refund, request private data in AI chat or send automatically. The owner checks the order, consumer rights and policy before replying.'
    ],
    file: 'Fictional weekly report',
    code: 'Period: 2030-01-07 to 2030-01-13 inclusive; USD\nSKU | units | price | refund amount\nNB-A | 10 | 20 | 20\nPN-B | 5 | 10 | 0\nGross: 10*20 + 5*10 = 250\nRefunds: 20\nAfter refunds: 230\nProfit / cash received / growth: UNKNOWN\nInventory: separate 14-day sample; NB-A REVIEW, PN-B HOLD\nSupport: parcel not received; outcome UNKNOWN\nReport/message status: OWNER REVIEW REQUIRED',
    check: 'Your report reconciles 250/20/230 without claiming profit/growth, and the support draft contains no invented outcome.',
    aiPrompt: 'Write a five-sentence report using these fictional weekly figures. Distinguish gross/after-refund amounts from profit/cash. Label the inventory period separately; do not invent growth. Draft a missing-parcel acknowledgement without a refund promise, private-data request or automatic sending: [data].'
  },
  {
    id: 'retail-service-handover',
    title: 'Deliver a bounded retail-support practice package',
    explanation: [
      'Package the brief, v1/v2 copy, claim ledger, cost assumptions, original inventory rows, checked formulas, report and support draft. Reopen files yourself and record actual observations. CSV is data, not a workbook with formulas or multiple sheets. Label all material FICTIONAL PRACTICE.',
      'Scope an initial service: one listing draft, two-SKU inventory review and one report, with one revision round. Separate time/tool costs from a proposed fee. Exclude publishing, purchases, payments, ads, guarantees and legal/tax certification. Agree approved data, limited permissions, retention/deletion, reviewer and handover before real work.',
      'Real owner approval is unavailable in this exercise: BLOCKED, never PASS. Decide practise more, revise, stop or seek consenting discovery from actual evidence. AI assists drafts and explanations, not business ownership or approval. Continue does not launch a live store.'
    ],
    file: 'Retail handover',
    code: 'Brief | listing v1/v2 | claim ledger | cost sources\nInventory raw/working/checks | report | support draft | revision log\nChecks: 5/25%; 26/11; 250/20/230; reopened files\nReal owner approval: BLOCKED - fictional practice\nScope/exclusions, actual time, internal costs, separately proposed fee:\nApproved data/access, retention/deletion, reviewer:\nDecision and evidence needed:',
    check: 'Your labelled portfolio is traceable, excludes live actions and leaves real owner approval blocked.',
    aiPrompt: 'Review this fictional retail-service handover for missing evidence, unclear scope, data/access risks and unsupported promises. Keep internal costs separate from fees. Do not invent approval, income or compliance: [package].'
  }
];

export const marketplaceSteps: TutorialStep[] = [
  {
    id: 'marketplace-model',
    title: 'Define a marketplace rather than a retailer',
    explanation: [
      'A multi-vendor marketplace connects independent sellers with buyers and may charge commission or other agreed fees. A retailer sells its own offer; a logistics provider fulfills goods for clients. The operator must define who sells, sets prices, holds goods, handles returns and receives payments. Do not assume a commission model removes legal or customer responsibilities.',
      'Practise a fictional stationery marketplace with two sellers and three orders in a spreadsheet. Interview consenting buyers and sellers separately; record actual evidence, not invented users or demand. Keep fees illustrative and all listings/order records private. No live website, payments or real account onboarding is required.'
    ],
    file: 'Marketplace hypothesis',
    code: 'Fictional operator: Cedar Market\nSeller S1: notebooks; seller S2: pens\nValue hypothesis: clear catalog and coordinated order status\nRevenue hypothesis: commission on retained merchandise amount\nActual buyer/seller interviews: NONE - demand UNVALIDATED\nWho sells / fulfills / refunds / pays tax: TO CONFIRM before launch\nExcluded: real onboarding, payments, publication and guarantees',
    check: 'You identify operator, sellers and buyers and leave demand and legal responsibilities unvalidated.',
    aiPrompt: 'Explain this marketplace model versus online retail and logistics. Write five neutral questions for buyers and five for sellers. Flag role/responsibility gaps without inventing demand, users or legal eligibility: [hypothesis].'
  },
  {
    id: 'marketplace-onboarding',
    title: 'Design seller onboarding and a draft platform',
    explanation: [
      'Prepare a seller checklist: identity/business verification through the chosen authorised service, permitted products, product facts/image permissions, stock updates, fees, fulfillment, returns and support responsibilities. Real verification happens through approved secure workflows, never an AI chat. Missing evidence leaves onboarding pending.',
      'Compare a hosted marketplace platform, a store platform with multi-vendor features and a custom build. Check current multi-seller support, exports, access controls, accessibility, maintenance and payment-provider suitability in your country. Prototype with paper screens or a draft/test workspace first. A mock-up is not a working marketplace.',
      'Before live payments, obtain appropriate review of contracts, consumer rights, privacy, taxes and payment/payout responsibilities. Use an eligible marketplace payment provider and its test mode; never collect card details yourself or assume you may hold customer funds. AI can draft questions and checklists, not certify sellers, contracts or payment compliance.'
    ],
    file: 'Seller onboarding checklist',
    code: 'Seller ID | approved products | fact/image evidence | fulfillment | returns | status\nS1 | notebooks | fictional brief only | seller role | TO CONFIRM | PRACTICE ONLY\nS2 | pens | fictional brief only | seller role | TO CONFIRM | PRACTICE ONLY\nPlatform capability/source/date:\nPayment provider/country eligibility: TO CONFIRM\nAccess: least privilege; no owner passwords or card data\nLive approval: BLOCKED',
    check: 'Your checklist assigns responsibilities and keeps real verification/payment approval outside AI and blocked until evidenced.',
    aiPrompt: 'Audit this draft marketplace onboarding checklist. Identify missing seller, returns, data and payment responsibilities. Compare platform approaches without guessing current fees/features. Do not request credentials/card data or certify contracts and sellers: [checklist].'
  },
  {
    id: 'marketplace-catalog',
    title: 'Use AI to normalise listings without inventing facts',
    explanation: [
      'Keep seller-provided facts and seller/SKU identifiers in an immutable source sheet. S1 supplies N1: two A5 ruled notebooks, 80 pages each; S2 supplies P1: three black-ink pens. Brand, certifications and delivery times are unknown. AI may format approved facts into a consistent catalog; it must not merge different sellers or add attributes.',
      'Create a claim ledger and a review queue. Reject recycled notebooks and refillable pens because no evidence supports them. Missing identifiers, image permission or safety information means pending review, not published. No fake reviews, paid-review manipulation, copied competitor copy or invented seller ratings.',
      'Test search/matching manually with two queries: A5 notebooks should show S1/N1; black-ink pens should show S2/P1. Waterproof notebook should return no verified match. Matching is a practice classification, not stock confirmation, seller endorsement or a recommendation to buy.'
    ],
    file: 'Catalog practice',
    code: 'seller_id | sku | approved facts | status\nS1 | N1 | 2 A5 ruled notebooks; 80 pages each | DRAFT\nS2 | P1 | 3 black-ink pens | DRAFT\nQueries: A5 notebooks -> S1/N1; black-ink pens -> S2/P1\nWaterproof notebook -> NO VERIFIED MATCH\nUnknown brand/images/certifications -> REVIEW\nClaim ledger: claim | source fact | keep/correct/remove',
    check: 'You preserve seller/SKU identity, reproduce three query outcomes and reject unsupported attributes.',
    aiPrompt: 'Normalise these two fictional listings using approved facts only. Preserve seller IDs/SKUs. Return a claim ledger and the three query results. Missing evidence means REVIEW or NO VERIFIED MATCH, not an invented attribute or rating: [catalog and queries].'
  },
  {
    id: 'marketplace-orders-and-commission',
    title: 'Reconcile orders, refunds and commission',
    explanation: [
      'Use three fictional USD orders: O1/S1 gross 100, refund 0; O2/S2 gross 80, refund 20; O3/S1 gross 50, refund 50. For this exercise only, the agreed commission is 10% of merchandise amount after refunds. Actual contracts may use different bases and refund treatment; this is not a platform fee quote.',
      'Retained merchandise amounts are 100, 60, 0; operator commissions are 10, 6, 0; seller allocations before other costs are 90, 54, 0. Totals reconcile: gross 230 - refunds 70 = retained 160 = commission 16 + seller allocations 144. S1 allocation is 90 and S2 is 54. These are worksheet allocations, not actual payouts or operator profit.',
      'Preserve each order ID and reject a repeated O2 rather than counting it twice. Unknown refund amounts stay unresolved. AI may explain the ledger and find inconsistencies; deterministic formulas and manual checks establish arithmetic. Provider fees, taxes, chargebacks, timing and reserves are omitted; no payment is sent.'
    ],
    file: 'Commission worksheet',
    code: 'order | seller | gross | refund | retained | 10% commission | seller allocation\nO1 | S1 | 100 | 0 | 100 | 10 | 90\nO2 | S2 | 80 | 20 | 60 | 6 | 54\nO3 | S1 | 50 | 50 | 0 | 0 | 0\nTotals: 230 | 70 | 160 | 16 | 144\nChecks: 230-70=160; 16+144=160\nDuplicate O2 -> ERROR/REVIEW, not another sale\nMissing refund -> UNRESOLVED, not zero\nNot actual payouts/profit; no money movement.',
    check: 'You reconcile 230/70/160/16/144 and seller allocations 90/54 and reject duplicate order counting.',
    aiPrompt: 'Audit this fictional ledger with 10% commission on amount after refunds. Show per-order, per-seller and total arithmetic. Flag duplicate IDs and missing refunds without silently choosing values. Do not call allocations paid or commission profit: [ledger].'
  },
  {
    id: 'marketplace-support',
    title: 'Plan moderated support and disputes',
    explanation: [
      'Map an order workflow: draft, seller accepted, packed, dispatched, delivery evidence received, closed; unresolved cases remain review-required. A status message alone is not delivery proof. Decide which person handles each stage and what evidence is needed, rather than allowing AI to approve completion.',
      'Practise one fictional damaged-parcel complaint with no known outcome. AI can summarise the complaint and draft a neutral acknowledgement. Route it to the authorised seller/operator reviewer; do not blame a party, promise compensation, issue refunds or send messages automatically. Actual rights and escalation deadlines need current local/platform checks.',
      'Keep moderation rules for prohibited claims/products, duplicate listings and suspicious reviews. Record reasons and a human appeal route. Do not infer fraud or penalise a seller solely from AI classification; protect personal data and restrict access to case records.'
    ],
    file: 'Support and escalation runbook',
    code: 'Case M1: damaged parcel reported; outcome UNKNOWN\nEvidence needed: approved order reference and permitted review records\nOwner: authorised operator/seller reviewer\nDraft: acknowledge; explain review; no invented refund/deadline\nStatus: REVIEW REQUIRED\nModeration: reason, evidence, reviewer, appeal route\nNo automated sending, penalties, payout or refund.',
    check: 'Your support draft preserves uncertainty and your runbook requires evidence, a reviewer and an appeal route.',
    aiPrompt: 'Summarise this fictional complaint and draft a neutral acknowledgement. List evidence and escalation questions without collecting private data, assigning blame or promising refunds/deadlines. Review the human moderation/appeal route: [case].'
  },
  {
    id: 'marketplace-handover',
    title: 'Package a marketplace operations prototype',
    explanation: [
      'Deliver a labelled fictional model canvas, seller checklist, catalog/claim ledger, three-order worksheet, support runbook and platform comparison. Reopen files and record checks. Paper screens and spreadsheets demonstrate workflow learning, not live multi-vendor software or payment readiness.',
      'Scope a support service or next validation phase: two seller profiles, two catalog drafts, a three-order reconciliation and one support case, with one revision round. Separate internal time/costs from a proposed fee. Exclude onboarding approval, money handling, legal certification, automatic moderation and guarantees.',
      'Real seller/operator approval and demand remain BLOCKED/UNVALIDATED without actual evidence. Continue means more discovery or supervised test-mode design, not live trading. Record what requires platform documentation and qualified review before any launch.'
    ],
    file: 'Marketplace handover',
    code: 'Model | seller checklist | catalog | claim ledger | order ledger | support runbook\nChecks: seller identity retained; three query outcomes; 230/70/160/16/144\nMethod: spreadsheet/paper prototype, not a live marketplace\nActual approval: BLOCKED; demand UNVALIDATED\nScope, exclusions, one revision, internal costs, separately proposed fee:\nNext evidence / reviewer / decision:',
    check: 'Your prototype contains checked outputs and makes no claim of live marketplace, payouts or approved sellers.',
    aiPrompt: 'Review this fictional marketplace handover for missing evidence, vague roles, payment/data risks and unsupported promises. Keep approval blocked and prototype limitations explicit. Do not invent users, income or launch readiness: [package].'
  }
];

export const logisticsSteps: TutorialStep[] = [
  {
    id: 'logistics-model-and-scope',
    title: 'Define logistics services for online businesses',
    explanation: [
      'A logistics provider may receive, store, pick, pack, dispatch and handle returned goods for retailers or marketplace sellers. It does not automatically own those goods or sell them. Define custody, inventory ownership, loss/damage handling, insurance and review responsibilities. This course practises ordinary fictional stationery only: no hazardous, regulated, temperature-controlled or safety-critical goods.',
      'Interview consenting businesses about order volume, errors, delivery expectations and their current process. Keep demand unvalidated until evidence exists. Compare self-operated storage, a fulfillment provider and carrier services using current local requirements and terms, not guessed rates. Physical facilities, worker safety, product handling and insurance require appropriate review before actual operations.',
      'Start with a spreadsheet and a written runbook, not live shipments. For future software, compare warehouse/order tools by SKU identity, audit trails, permissions, exports and integration support. Use draft/test mode and fictional data; never upload customer addresses, access codes or confidential stock records to AI chat.'
    ],
    file: 'Fictional logistics brief',
    code: 'Client C1 owns ordinary notebooks and pens\nService hypothesis: receive, store, pick/pack and prepare dispatch records\nPractice: 2 stock rows, 3 orders, 1 return, 1 cost worksheet\nExcluded: actual shipments, route control, regulated goods, liability/legal advice\nCountry, facility, safety/insurance requirements: TO CONFIRM\nDemand UNVALIDATED; real client approval BLOCKED',
    check: 'You separate logistics custody from retail ownership and exclude live shipments and regulated goods.',
    aiPrompt: 'Scope this fictional logistics service. Write neutral discovery questions and list responsibility, facility, safety, insurance and data checks requiring qualified review. Compare software approaches without invented rates or certification: [brief].'
  },
  {
    id: 'logistics-receiving-and-stock',
    title: 'Check receiving and stock discrepancies',
    explanation: [
      'Keep source, counted units, location, condition and reviewer separately. Fictional expected receipt: NB-A 30, PN-B 20. Counted: NB-A 28 usable plus 2 damaged/quarantined; PN-B 20 usable. Reconcile NB-A as 30 total = 28 usable + 2 quarantined, but do not include damaged units in available stock.',
      'Assign practice locations A1 and B1 and preserve the discrepancy log. Unknown counts or condition mean review, not available. AI can summarise the log and draft questions; it cannot inspect goods, approve damage claims or replace a physical count.',
      'For real receiving, use the authorised procedure and appropriate training. A spreadsheet simulation does not establish a safe storage layout, load limit or handling method. Quarantined goods require an authorised disposition decision before any release.'
    ],
    file: 'Receiving worksheet',
    code: 'SKU | expected | usable | quarantined | total | location\nNB-A | 30 | 28 | 2 | 30 | A1\nPN-B | 20 | 20 | 0 | 20 | B1\nNB-A discrepancy: 2 damaged; REVIEW, not available\nEvidence: fictional count only; no real inspection\nUnknown condition/count -> REVIEW\nRelease/disposal: authorised owner decision required',
    check: 'You reconcile 30 and 20 total receipts while keeping only 28 and 20 usable units available.',
    aiPrompt: 'Reconcile this fictional receipt and distinguish usable from quarantined stock. Draft a discrepancy note without claiming a physical inspection or deciding compensation/disposal. Missing counts stay unresolved: [rows].'
  },
  {
    id: 'logistics-pick-and-pack',
    title: 'Simulate picking with stock and duplicate checks',
    explanation: [
      'Process fictional orders in order: L1 needs NB-A 5 and PN-B 3; L2 needs NB-A 25; L3 needs PN-B 4. Begin with usable stock NB-A 28 and PN-B 20. Reserve L1: remaining available NB-A 23 and PN-B 17. L2 cannot be fulfilled in full: HOLD with shortage 2; reserve nothing for L2 in this exercise. Reserve L3: PN-B 13.',
      'Final available stock is NB-A 23 and PN-B 13; reserved totals are NB-A 5 and PN-B 7. Quarantined units remain excluded. Repeat L1 must be flagged as duplicate, not picked again. This exercise assumes all-or-nothing reservations; actual partial-fill/backorder rules require the client to define them.',
      'Create a pick/check/pack checklist with SKU, quantity, condition and reviewer. A reservation is not a physical pick or shipment. AI can explain shortages and organise a checklist; it must not override stock counts or certify package preparation.'
    ],
    file: 'Order simulation',
    code: 'Start usable: NB-A 28; PN-B 20\nL1: NB-A 5, PN-B 3 -> RESERVED\nL2: NB-A 25 -> HOLD, shortage 2; no reservation\nL3: PN-B 4 -> RESERVED\nFinal available: NB-A 23; PN-B 13\nReserved: NB-A 5; PN-B 7\nRepeated L1 -> DUPLICATE/REVIEW\nPick/pack evidence: NOT PERFORMED - simulation only',
    check: 'You reproduce 23/13 available and 5/7 reserved, hold L2 and reject duplicate L1.',
    aiPrompt: 'Walk through these orders sequentially with all-or-nothing reservations and usable stock only. Show balances, shortage and duplicate checks. Do not use quarantined stock or call reservations packed/shipped: [orders].'
  },
  {
    id: 'logistics-dispatch-and-returns',
    title: 'Plan dispatch evidence and controlled returns',
    explanation: [
      'Write a dispatch checklist: approved order, completed pick/pack checks, verified destination in the authorised system, carrier/service eligibility, agreed delivery terms and evidence of carrier acceptance. A generated tracking number or planned pickup is not proof of dispatch/delivery. This exercise sends nothing and stores no customer addresses.',
      'Use AI to draft a status message saying an order is being reviewed, not delivered. A human checks actual carrier records before updating status or replying. Routing tools may assist planning, but routes, access restrictions and driver safety require real-world review; this course provides no operational route instructions.',
      'Simulate return R1: one NB-A unit is reported returned from a previously completed order outside this reservation exercise. Keep it quarantined pending inspection; do not add it to available stock or alter the 23/13 balances. Disposition and any refund are separate authorised decisions, not AI outputs.'
    ],
    file: 'Dispatch and return log',
    code: 'Order | pick/pack evidence | carrier acceptance | status\nL1 | NOT PERFORMED | NONE | RESERVED ONLY\nL3 | NOT PERFORMED | NONE | RESERVED ONLY\nR1: 1 NB-A from earlier order; quarantine pending inspection\nAvailable after R1: NB-A 23; PN-B 13 (unchanged)\nReturn approval / refund: UNKNOWN, no automatic action\nNo address data, shipments or generated delivery proof',
    check: 'You distinguish reservation, dispatch and delivery evidence and keep R1 out of available stock pending inspection.',
    aiPrompt: 'Audit this fictional dispatch/return log. Identify missing evidence and draft a truthful review-status message. Keep R1 quarantined and balances unchanged. Do not invent tracking, inspection, delivery or refund approval: [log].'
  },
  {
    id: 'logistics-cost-and-report',
    title: 'Calculate service contribution and report exceptions',
    explanation: [
      'Invented USD planning example: service fee 8 per processed order, labour allowance 3, packaging 1 and overhead allowance 2. Contribution = 8 - 3 - 1 - 2 = USD 2/order, or 25% of fee. For 10 hypothetical processed orders: fees 80, allowances 60, contribution 20. These are not market rates or actual revenue; shipping, insurance, taxes and other costs remain excluded/unknown.',
      'Keep this 10-order cost scenario separate from the three-order reservation exercise. Report the observed practice outcomes: two reserved, one held, zero physical picks/shipments, one duplicate test rejected and one returned unit pending inspection. Do not claim delivery success or cost savings.',
      'Ask AI for a five-sentence exception report, then check every figure and status against the source. Before a real offer, record actual time, volumes, vendor rates, exceptions and who pays carrier/return costs. Unknown costs prevent a complete profit estimate.'
    ],
    file: 'Cost and exception report',
    code: 'Illustrative USD: 8 - 3 - 1 - 2 = 2/order; 25%\n10 hypothetical processed orders: 80 - 60 = 20\nExcluded/unknown: shipping, insurance, taxes, other costs\nSeparate order simulation: 2 reserved; 1 held; 0 physical shipments\nDuplicate test: 1 rejected; return: 1 unit quarantined pending inspection\nActual savings, revenue and delivery success: NOT ESTABLISHED',
    check: 'You calculate 2/25% and 80/60/20 without mixing hypothetical costs with simulation outcomes.',
    aiPrompt: 'Audit these fictional cost calculations and write a five-sentence exception report. Keep the 10-order scenario separate from the three-order simulation. Do not claim actual shipments, savings, profit or complete costs: [figures].'
  },
  {
    id: 'logistics-handover',
    title: 'Deliver a traceable logistics service prototype',
    explanation: [
      'Package the scope, receiving/condition log, preserved source rows, reservation worksheet, duplicate/shortage checks, dispatch/return runbook and cost/exception report. Reopen files and record actual checks. State spreadsheet simulation clearly: it is not a warehouse operation, stock inspection or carrier integration.',
      'Scope a first support engagement around inventory-record cleanup and reviewed order-status reporting, not physical logistics beyond competence. Define client-owned stock, access limits, handover, retention/deletion, reviewer, one revision and exclusions. Actual facilities/handling, insurance and contracts require separate appropriate approval.',
      'Keep real client approval BLOCKED and demand UNVALIDATED without evidence. Separate time/internal costs from a proposed fee. Continue means further discovery or supervised practice, never automatic shipping, stock release, refunds or operational certification.'
    ],
    file: 'Logistics handover',
    code: 'Scope | receipt log | raw/working stock | reservations | exceptions\nDispatch/returns runbook | costs | report | revision log\nChecks: usable 28/20; final available 23/13; reserved 5/7; L2 held\nR1 quarantined; 0 actual shipments; 2/25%; hypothetical 80/60/20\nReal approval BLOCKED; physical operations NOT PERFORMED\nData/access, retention/deletion, reviewer, proposed fee, exclusions:\nNext evidence and decision:',
    check: 'Your prototype contains checked records and makes no claims of physical fulfillment, real approval or complete profitability.',
    aiPrompt: 'Review this fictional logistics handover for missing evidence, unclear custody, data/access risks and unsupported operational promises. Keep simulation and real operations separate. Do not invent approval, inspections, insurance or income: [package].'
  }
];
