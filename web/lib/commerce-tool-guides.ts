import type { TutorialStep } from '@/lib/task-tracker-tutorial';

type CommerceToolGuide = {
  toolId: string;
  title: string;
  intro: string;
  steps: TutorialStep[];
};

export const commerceToolGuides: CommerceToolGuide[] = [
  {
    toolId: 'shopify',
    title: 'Shopify: a reviewed storefront practice',
    intro: 'Plan a draft store, verify product copy with optional AI and compare total costs. A document-only alternative needs no account, purchase or publication.',
    steps: [
      {
        id: 'shopify-plan',
        title: 'Check eligibility and plan a draft store',
        explanation: [
          'Use the official getting-started and pricing pages to check your country, current plans, trial terms, payment eligibility, taxes and channel requirements. Exact screens, fees and optional AI availability can change. Source pages could not be live-checked when this guide was added; verify them before registering or spending.',
          'If eligible and authorised, the owner registers directly, keeps the storefront unpublished and uses only permitted test/draft workflows. Do not enable checkout, connect live payments, buy a domain or import customer data for this exercise. No trial is required: a private document with product, delivery and returns sections is sufficient and must be labelled a mock-up, not a functioning store.'
        ],
        file: 'Store setup worksheet',
        code: 'Mode: document mock-up / authorised unpublished test store\nCountry and current eligibility: TO CONFIRM\nPlan, trial end, renewal, transaction/payment fees: TO CONFIRM\nPages: product, delivery, returns, contact (fictional placeholders)\nPayments, checkout and publication: DISABLED / NOT CONFIGURED\nApproved data: fictional product facts only',
        check: 'You record plan/eligibility unknowns and keep the store unpublished, or honestly label a document-only mock-up.',
        aiPrompt: 'Help organise this fictional storefront setup checklist. Ask for current non-sensitive options I see rather than inventing menus, fees or trial terms. Do not request passwords, connect payments or claim the mock-up is live: [worksheet].',
        resources: [{ label: 'Shopify getting started', url: 'https://help.shopify.com/en/manual/intro-to-shopify' }, { label: 'Shopify pricing', url: 'https://www.shopify.com/pricing' }]
      },
      {
        id: 'shopify-copy',
        title: 'Draft product copy and verify every claim',
        explanation: [
          'Fictional NB-A is a pack of two A5 paper-cover notebooks with 80 ruled pages each. Draft a title, three bullets and short description in your document or unpublished product record. Brand, certifications, supplier, shipping time and price remain unknown.',
          'An external AI assistant is optional; do not assume built-in AI is included. Give it only those facts. Check every sentence against the brief, remove waterproof and recycled claims, and use only original/permissioned assets with accurate alt text. Keep identifiers and unknowns visible. Do not copy competitors, fabricate reviews or publish automatically.'
        ],
        file: 'Product claim ledger',
        code: 'Title: A5 Ruled Notebooks, 80 Pages Each, Pack of 2\n2 notebooks -> KEEP (brief)\n80 ruled pages each -> KEEP (brief)\nWaterproof -> REMOVE (no evidence)\nRecycled -> REMOVE (no evidence)\nDelivery date, price, brand -> TO CONFIRM\nOutput: 1 title + 3 bullets + short description; DRAFT',
        check: 'The draft has the required shape, rejects two unsupported claims and does not invent price or delivery.',
        aiPrompt: 'Draft one title, three bullets and a short description using only these fictional notebook facts. Return a claim/evidence ledger. Mark unknowns, reject waterproof/recycled claims and require owner review. No publishing or sales guarantees: [facts].'
      },
      {
        id: 'shopify-review',
        title: 'Compare costs and hand over the draft',
        explanation: [
          'Use invented USD figures: price 20 minus product 6, channel/payment allowance 3, fulfillment 4, inbound 1 and returns 1 gives contribution 5 (25% of price). This is not Shopify pricing or net profit: subscription, apps, ads, storage, taxes and overhead are excluded/unknown. Record actual vendor cost sources and dates separately.',
          'Reopen the draft and ledger; check facts, readable layout, keyboard access and unconfigured checkout. Record actual observations. Missing owner approval stays BLOCKED. Do not claim a document mock-up proves store accessibility or checkout. Real launch needs approved products, policies, payments and country-specific review.'
        ],
        file: 'Store handover',
        code: 'Illustrative contribution: 20-6-3-4-1-1=5; 5/20=25%\nActual subscription/apps/payment costs: TO CONFIRM\nDraft and ledger reopened; observed checks:\nMethod: document / unpublished store\nReal owner approval: BLOCKED\nNo live checkout, publication or actual revenue',
        check: 'You verify 5/25%, separate costs from vendor quotes and hand over a clearly labelled draft.',
        aiPrompt: 'Audit the fictional arithmetic and handover. Identify omitted recurring/transaction costs and unresolved approvals. Keep contribution distinct from profit; do not invent actual prices, checkout results or revenue: [worksheet].',
        resources: [{ label: 'Shopify pricing', url: 'https://www.shopify.com/pricing' }]
      }
    ]
  },
  {
    toolId: 'sharetribe',
    title: 'Sharetribe: a marketplace workflow practice',
    intro: 'Compare marketplace capabilities, create two fictional seller listings and reconcile an illustrative commission ledger without live payments.',
    steps: [
      {
        id: 'sharetribe-plan',
        title: 'Check the marketplace model and test options',
        explanation: [
          'Check official documentation for supported listing/transaction models, current test/live plans, payment-provider country eligibility, exports and access controls. Do not assume the platform fits physical goods, multi-seller baskets or your required fulfillment model. These sources were not live-checked when the guide was added.',
          'An authorised owner can inspect permitted test mode after checking terms; otherwise draw paper screens for seller onboarding, catalog and orders. No real sellers, identity documents, card details or funds belong in this exercise. A marketplace payment arrangement and who sells, fulfills, refunds and pays tax need appropriate review before launch.'
        ],
        file: 'Marketplace capability checklist',
        code: 'Need | official source/date | supported? | unresolved issue\nTwo sellers / product listings / required transaction model:\nCountry, payments, commissions, exports, permissions:\nPlan, test/live terms, subscription and provider fees: TO CONFIRM\nMode: paper prototype / authorised test mode\nLive seller onboarding and payments: NOT ENABLED',
        check: 'You document fit/eligibility rather than assuming features and use only paper or permitted test mode.',
        aiPrompt: 'Review these marketplace requirements against the current official information I provide. Flag unsupported or unknown capabilities, payment and responsibility gaps. Do not invent plan features or eligibility or request credentials: [checklist].',
        resources: [{ label: 'Sharetribe documentation', url: 'https://www.sharetribe.com/docs/' }, { label: 'Sharetribe pricing', url: 'https://www.sharetribe.com/pricing/' }]
      },
      {
        id: 'sharetribe-catalog',
        title: 'Normalise two seller listings with optional AI',
        explanation: [
          'Keep S1/N1: two A5 ruled notebooks, 80 pages each; S2/P1: three black-ink pens. Draft consistent listings in a private worksheet or supported test workflow. Preserve seller/SKU identity and leave brands, images, certifications and delivery times unknown.',
          'AI may rewrite facts, not verify sellers or invent attributes. Test A5 notebooks -> S1/N1, black-ink pens -> S2/P1, waterproof notebook -> NO VERIFIED MATCH. Reject recycled notebooks and refillable pens. These are manual practice classification checks, not proof of platform search, verified availability or seller endorsement.'
        ],
        file: 'Catalog and matching checks',
        code: 'S1/N1: 2 A5 ruled notebooks, 80 pages each\nS2/P1: 3 black-ink pens\nA5 notebooks -> S1/N1\nBlack-ink pens -> S2/P1\nWaterproof notebook -> NO VERIFIED MATCH\nUnknown brand/images/permissions -> REVIEW\nNo publication or actual seller verification',
        check: 'You preserve identities, reproduce three manual outcomes and reject unsupported attributes.',
        aiPrompt: 'Normalise two fictional listings with seller/SKU IDs intact. Return a claim ledger and the three query outcomes from approved facts only. Do not invent attributes, reviews, seller verification or platform-search results: [rows].'
      },
      {
        id: 'sharetribe-ledger',
        title: 'Reconcile illustrative commission and approval',
        explanation: [
          'For fictional orders O1/S1 gross 100/refund 0, O2/S2 80/20 and O3/S1 50/50, use a made-up agreement of 10% on merchandise after refunds. Gross 230 - refunds 70 = retained 160; commission 16 plus seller allocation 144 = 160. Seller allocations are S1 90 and S2 54.',
          'This is not a Sharetribe fee schedule, payment integration or actual payout. Provider fees, reserves, chargebacks, taxes and subscription costs are excluded/unknown. Flag repeated O2 as duplicate and missing refund as unresolved. Reopen the ledger and capability checklist; actual seller/operator approval stays BLOCKED. No money moves.'
        ],
        file: 'Commission practice',
        code: 'Order | gross | refund | retained | commission | allocation\nO1 | 100 | 0 | 100 | 10 | 90\nO2 | 80 | 20 | 60 | 6 | 54\nO3 | 50 | 50 | 0 | 0 | 0\nTotals: 230 / 70 / 160 / 16 / 144\nS1 allocation 90; S2 54; not actual payouts/profit\nDuplicate O2 -> REVIEW; missing refund -> UNRESOLVED\nReal approval BLOCKED; live payments disabled',
        check: 'You reconcile the five totals and two allocations, reject duplicates and leave actual payment approval blocked.',
        aiPrompt: 'Audit this fictional 10%-after-refunds ledger by order and seller. Flag duplicates and missing amounts; explain excluded costs. Do not claim this is platform pricing, actual payouts or operator profit: [ledger].',
        resources: [{ label: 'Sharetribe pricing', url: 'https://www.sharetribe.com/pricing/' }]
      }
    ]
  },
  {
    toolId: 'zoho-inventory',
    title: 'Zoho Inventory: a checked stock-record practice',
    intro: 'Compare inventory capabilities, preserve fictional source rows and review shortages with optional AI explanations. A spreadsheet alternative avoids live stock changes.',
    steps: [
      {
        id: 'zoho-plan',
        title: 'Verify stock workflow fit before connecting accounts',
        explanation: [
          'Use official help and pricing to check current country editions, plans, order/item limits, warehouse features, exports and supported sales-channel integrations. These pages were not live-checked when this guide was added. Never assume an integration, AI feature or plan limit is included.',
          'Use a private spreadsheet or permitted isolated test organisation after the owner checks terms. Keep real stores, accounting, carrier and customer accounts disconnected. Set fictional SKU/location conventions, distinguish usable/reserved/quarantined units and preserve the source before any import. Do not submit a real purchase or change stock.'
        ],
        file: 'Inventory setup checklist',
        code: 'Mode: spreadsheet / authorised isolated test organisation\nSKU, units, location and condition rules:\nRequired features, limits, exports, source/date: TO CONFIRM\nSubscription, add-ons, integration costs: TO CONFIRM\nLive imports/connectors/purchases: NOT ENABLED\nData: fictional only; source preserved',
        check: 'You record required features and unknown costs and isolate the exercise from real stock and accounts.',
        aiPrompt: 'Help compare my inventory requirements with current official information I supply. Flag unknown limits, editions and integrations. Do not invent menus, prices, stock counts or activate connections: [checklist].',
        resources: [{ label: 'Zoho Inventory help', url: 'https://www.zoho.com/inventory/help/' }, { label: 'Zoho Inventory pricing', url: 'https://www.zoho.com/inventory/pricing/' }]
      },
      {
        id: 'zoho-stock',
        title: 'Reconcile usable stock and reservations',
        explanation: [
          'Fictional receipt NB-A 30 total contains 28 usable and 2 damaged/quarantined; PN-B 20 total is all usable. Keep damaged units unavailable. Process whole-order reservations: L1 needs NB-A 5/PN-B 3; L2 needs NB-A 25; L3 needs PN-B 4.',
          'After L1, usable available NB-A is 23 and PN-B 17. L2 is HOLD with shortage 2; reserve nothing for it. After L3, available is 23/13 and reserved is 5/7. Repeat L1 -> DUPLICATE/REVIEW. AI explains the worksheet but cannot inspect goods or establish actual software reservation behavior; label manual versus observed test results honestly.'
        ],
        file: 'Stock simulation',
        code: 'Receipt: NB-A total 30 = usable 28 + quarantine 2\nPN-B usable 20\nL1: NB-A 5, PN-B 3 -> RESERVED\nL2: NB-A 25 -> HOLD; shortage 2; reserve nothing\nL3: PN-B 4 -> RESERVED\nFinal available NB-A 23 / PN-B 13; reserved 5 / 7\nRepeated L1 -> DUPLICATE/REVIEW\nNo physical picks, shipments or real inventory updates',
        check: 'You reconcile 30/28/2 and reproduce 23/13 available and 5/7 reserved without using damaged units.',
        aiPrompt: 'Audit this fictional stock simulation sequentially with whole-order reservations. Show shortage and balances, exclude quarantined units and flag duplicates. Do not invent inspection or actual software-test evidence: [rows].'
      },
      {
        id: 'zoho-handover',
        title: 'Review exceptions, costs and exports',
        explanation: [
          'Create an exception report: one held order, two reserved orders, two quarantined notebook units and one duplicate test rejected. Missing condition or quantity stays REVIEW, not zero/available. Keep this simulation separate from actual operational performance.',
          'Reopen the source/working spreadsheet; if an authorised test organisation was used, verify supported exports and record what actually happened. CSV is not a multi-sheet/formula workbook. Check subscription, add-on, storage/integration and training costs with source/date; no savings are established. Real owner approval remains BLOCKED.'
        ],
        file: 'Inventory handover',
        code: 'Exceptions: L2 held; L1/L3 reserved; NB-A 2 quarantined\nDuplicate test rejected; missing counts -> REVIEW\nOriginal source, working balances, exception ledger, reopened export:\nActual software observations (or manual-only):\nCosts/source/date: TO CONFIRM\nReal owner approval BLOCKED; savings NOT ESTABLISHED',
        check: 'Your handover preserves source and exceptions, distinguishes manual tests from software behavior and leaves approval blocked.',
        aiPrompt: 'Draft a five-sentence report of these fictional exceptions and review my handover. Keep source, missing values and method visible; do not claim savings, physical inspection or approved stock changes: [records].',
        resources: [{ label: 'Zoho Inventory pricing', url: 'https://www.zoho.com/inventory/pricing/' }]
      }
    ]
  },
  {
    toolId: 'shippo',
    title: 'Shippo: a no-shipment dispatch planning practice',
    intro: 'Check carrier and country fit, draft a dispatch/return evidence checklist and compare illustrative costs without labels, addresses or real shipments.',
    steps: [
      {
        id: 'shippo-plan',
        title: 'Check carrier eligibility and safe practice options',
        explanation: [
          'Check official support and pricing for supported origin countries, carriers/services, account requirements, plans, postage/label charges and refunds. Sources were not live-checked when the guide was added. Shipping availability depends on route, parcel and carrier rules; do not assume coverage or a free label.',
          'Practise in a document only; an account is unnecessary. If later exploring a provider-authorised test workflow, verify its exact limitations first. Do not enter actual addresses, buy labels, book pickups, connect a store or send parcels. AI cannot certify packaging, restricted-goods eligibility or safe transport.'
        ],
        file: 'Carrier fit worksheet',
        code: 'Mode: document-only; no carrier account required\nOrigin/destination country (no addresses): TO CONFIRM\nOrdinary fictional stationery only\nCarrier/service, parcel requirements, support, source/date:\nPlan/postage/label/refund charges: TO CONFIRM\nLabels/pickups/live connectors/shipments: NOT CREATED',
        check: 'You record coverage/cost unknowns and keep real labels, pickups and addresses out of the exercise.',
        aiPrompt: 'Review this fictional shipping-fit checklist against current official non-sensitive information I provide. List missing coverage, costs and responsibilities. Do not request addresses or credentials or create labels/shipments: [worksheet].',
        resources: [{ label: 'Shippo support', url: 'https://support.goshippo.com/' }, { label: 'Shippo pricing', url: 'https://goshippo.com/pricing/' }]
      },
      {
        id: 'shippo-evidence',
        title: 'Draft truthful dispatch and return records',
        explanation: [
          'Fictional L1 is reserved only: no physical pick/pack and no carrier acceptance. List evidence needed: approved order, actual quantity/condition checks, authorised destination verification, carrier eligibility and acceptance record. A generated tracking number or planned pickup is not dispatch/delivery evidence.',
          'Return R1 is one notebook from an earlier order, pending inspection in quarantine. Do not restock or promise a refund. Ask AI for a neutral review-status message with no invented delivery time, tracking or compensation. A person reviews actual carrier/order records before any update; the exercise sends nothing.'
        ],
        file: 'Dispatch/return evidence',
        code: 'L1: RESERVED ONLY; pick/pack NOT PERFORMED; carrier acceptance NONE\nDispatch/delivery: NOT ESTABLISHED\nR1: 1 notebook; quarantine pending inspection\nRestock/disposition/refund: UNKNOWN; authorised review required\nMessage: acknowledge review, no promised date/refund/tracking\nNo actual addresses, labels or messages sent',
        check: 'Your records distinguish reservation from dispatch/delivery and keep R1 quarantined without invented outcomes.',
        aiPrompt: 'Audit these fictional dispatch/return records and draft a brief truthful review-status message. List missing evidence; do not invent tracking, delivery, inspection, refund approval or send anything: [log].'
      },
      {
        id: 'shippo-costs',
        title: 'Compare total shipping allowances and hand over',
        explanation: [
          'Illustrative USD scenario A: carrier allowance 5 + packaging 1 + handling 2 = 8; scenario B: 7 + 1 + 1 = 9. These are invented amounts, not Shippo rates or actual quotes. Transit times, taxes, surcharges, insurance, subscription and return charges are unknown; a lower subtotal alone does not justify choosing a carrier.',
          'Ask AI to explain differences and missing inputs, verify arithmetic yourself and reopen the worksheet/runbook. Record actual quote sources/dates when available. Physical packaging, route eligibility and real client approval require appropriate review and remain unverified/BLOCKED. No live integration or shipment is implemented.'
        ],
        file: 'Shipping comparison',
        code: 'Invented USD A: 5+1+2=8; B: 7+1+1=9\nNot carrier quotes or vendor fees\nTransit, surcharges, taxes, insurance, subscription, returns: UNKNOWN\nSource/date and evidence needed:\nReopened worksheet/runbook observations:\nReal approval BLOCKED; zero labels/pickups/shipments',
        check: 'You calculate 8/9 and retain missing costs/approval instead of claiming the cheapest option is ready to ship.',
        aiPrompt: 'Audit these two fictional shipping subtotals. Explain unknown costs, timing and eligibility without choosing a carrier or inventing quotes. Check handover evidence; no live shipping: [worksheet].',
        resources: [{ label: 'Shippo pricing', url: 'https://goshippo.com/pricing/' }]
      }
    ]
  },
  {
    toolId: 'zendesk',
    title: 'Zendesk: a human-reviewed support practice',
    intro: 'Plan a private ticket workflow, draft safe responses with optional AI and review costs and escalation rules without real customer records or automatic sending.',
    steps: [
      {
        id: 'zendesk-plan',
        title: 'Check ticket, AI and access requirements',
        explanation: [
          'Check current official support and pricing for ticket features, channels, seats, trial/renewal terms, AI availability and any usage-based charges. Sources were not live-checked when this guide was added. Do not assume built-in AI, a sandbox or automatic routing is available in your plan.',
          'Use a private document with fictional ticket IDs; no account is needed. An authorised isolated test workspace is optional only if allowed by current terms. Keep real inboxes/customer accounts disconnected and automatic sending disabled. Define authorised reviewers, limited access and retention/deletion before real data; do not copy customer complaints into AI.'
        ],
        file: 'Support setup worksheet',
        code: 'Mode: private document / authorised isolated test workspace\nChannels and outbound messages: DISCONNECTED / DISABLED\nTicket fields: fictional ID, summary, evidence, reviewer, next action\nSeats/subscription/AI/add-ons/usage charges: TO CONFIRM\nAI availability and data handling source/date:\nCustomer data, credentials and live automation: NONE',
        check: 'You keep the workflow isolated and record seat/AI costs and access unknowns without enabling messaging.',
        aiPrompt: 'Help plan this fictional support workflow. Review current plan information I supply and flag missing seat/AI charges, data rules and reviewers. Do not invent features or request credentials/customer records: [worksheet].',
        resources: [{ label: 'Zendesk support', url: 'https://support.zendesk.com/' }, { label: 'Zendesk pricing', url: 'https://www.zendesk.com/pricing/' }]
      },
      {
        id: 'zendesk-drafts',
        title: 'Draft and classify three fictional cases',
        explanation: [
          'T1: parcel not received, outcome unknown. T2: notebook arrived damaged, inspection/refund unknown. T3: suspected account-access issue, unverified. Route T1/T2 to the authorised order reviewer and T3 to the authorised account/security process. This is manual practice triage, not an investigation or actual software routing test.',
          'AI may summarise and draft a neutral acknowledgement for each case. No passwords, payment details, refund promises, blame or guaranteed deadlines. Do not infer fraud or customer intent. Include a human reviewer and unresolved evidence; do not send automatically or allow AI to close the case.'
        ],
        file: 'Fictional ticket review queue',
        code: 'T1 | parcel not received | order reviewer | REVIEW REQUIRED\nT2 | damaged notebook | order reviewer | REVIEW REQUIRED\nT3 | suspected access issue | authorised account/security process | REVIEW REQUIRED\nEach: summary + acknowledgement + missing evidence + reviewer\nOutcomes UNKNOWN; no refund/delivery/access promises\n0 messages sent; 0 cases closed automatically',
        check: 'You create three reviewed draft records, route T3 separately and keep all outcomes unresolved.',
        aiPrompt: 'Summarise and draft a neutral acknowledgement for each fictional ticket. Give reviewer route and missing evidence. No private-data requests, passwords, blame, invented refunds/deadlines or automatic closure/sending: [tickets].'
      },
      {
        id: 'zendesk-report',
        title: 'Check quality, costs and escalation handover',
        explanation: [
          'Verify all three drafts against the scenario, plain-language readability and human escalation rules. Report three review-required cases and zero messages sent; you cannot claim response-time improvement, resolved tickets or customer satisfaction from this exercise.',
          'Record actual seat count, subscription, AI/add-on usage, setup and training costs separately from a proposed service fee. Unknown costs stay unknown. Reopen the queue and runbook, define access removal and retention, and leave real owner approval BLOCKED. Optional AI features do not remove human accountability.'
        ],
        file: 'Support quality handover',
        code: '3 fictional cases -> REVIEW REQUIRED\nMessages sent 0; automatic closures 0\nReal resolutions/satisfaction/time saved: NOT ESTABLISHED\nCosts/source/date: TO CONFIRM; proposed fee separately chosen\nQueue/runbook reopened; access removal/retention plan:\nReal approval BLOCKED',
        check: 'Your report accurately states three pending cases and zero sending, with clear costs, escalation and unresolved approval.',
        aiPrompt: 'Audit these fictional support drafts and handover. Flag unsupported outcomes, unclear escalation, data retention and cost assumptions. Do not claim satisfaction, savings, actual resolutions or approval: [records].',
        resources: [{ label: 'Zendesk pricing', url: 'https://www.zendesk.com/pricing/' }]
      }
    ]
  },
  {
    toolId: 'looker-studio',
    title: 'Google Data Studio (Looker Studio): a reconciled business report practice',
    intro: 'Plan a private report, reconcile fictional sales data and use optional AI to explain limitations. A spreadsheet-only alternative requires no dashboard account.',
    steps: [
      {
        id: 'looker-plan',
        title: 'Check connectors, costs and private sharing',
        explanation: [
          'Check official documentation for report setup, supported connectors, credentials, sharing and current product/Pro pricing. Sources were not live-checked when this guide was added. A connector or upstream data service may charge separately; do not assume the whole workflow or AI is free/included.',
          'Use a spreadsheet-only report or an authorised private report from fictional data. Google Data Studio was formerly called Looker Studio. If using it, verify the connector supports your source and keep report/data permissions restricted; do not publish, link a real store or expose owner-credential data to others. AI use is external and optional. Never upload customer or financial records for this exercise.'
        ],
        file: 'Report setup checklist',
        code: 'Mode: spreadsheet report / authorised private Data Studio report\nSource: fictional aggregate rows only\nConnector/credential/sharing eligibility: TO CONFIRM\nProduct/Pro, connector and upstream costs: TO CONFIRM\nPublic links, real store data and automatic sharing: DISABLED\nPeriod/currency/refund meaning documented',
        check: 'You record connector/cost and permission requirements and keep the source/report private.',
        aiPrompt: 'Help plan a private report from fictional aggregate data. Review current connector and pricing information I provide. Flag sharing/credential risks and unknown costs without requesting secrets or assuming features: [checklist].',
        resources: [{ label: 'Data Studio documentation', url: 'https://docs.cloud.google.com/data-studio/welcome' }, { label: 'Data Studio product and plan information', url: 'https://cloud.google.com/data-studio' }]
      },
      {
        id: 'looker-reconcile',
        title: 'Build a checked table and chart',
        explanation: [
          'For 2030-01-07 through 2030-01-13 inclusive, USD, NB-A has units 10, price 20, refund amount 20; PN-B units 5, price 10, refund amount 0. Compute gross = units x price and after refunds = gross - refund amount per row, then sum. Totals are 250 gross, 20 refunds and 230 after refunds, not profit or cash received.',
          'Build the table in your spreadsheet; if using a verified connector, reproduce the same totals in the report and record the actual comparison. A two-product bar chart should start at zero, show currency/period and include a readable text table alternative. Do not use a time trend with one period or infer growth without earlier data. AI explains numbers; deterministic formulas and manual checks verify them.'
        ],
        file: 'Fictional report source',
        code: 'sku,units,price,refund_amount\nNB-A,10,20,20\nPN-B,5,10,0\nGross per row: 200 / 50; after refunds: 180 / 50\nTotals: gross 250; refund 20; after refunds 230\nPeriod: 2030-01-07 to 2030-01-13 inclusive; USD\nProfit/cash received/growth: UNKNOWN\nChart: zero baseline + currency + period + text table',
        check: 'You reconcile row and total amounts and include period/currency and an accessible table without unsupported growth.',
        aiPrompt: 'Audit these fictional rows and draft a five-sentence report. Show 250/20/230 reconciliation and distinguish amounts from profit/cash. No previous period means growth unknown. Suggest a clear chart with zero baseline and text table, not fabricated trends: [rows].'
      },
      {
        id: 'looker-quality',
        title: 'Review data quality and share only with approval',
        explanation: [
          'Test missing refund data: after-refund totals become incomplete/UNRESOLVED, not a complete report that assumes zero. Duplicate rows require source investigation; do not silently sum or remove conflicting data. Record source date, period, currency, known omissions and field definitions. Spreadsheet-only work cannot establish connector refresh success.',
          'Reopen the report, check filters/aggregation and restricted access in the actual chosen tool. Validate the chart against the table and record observations. Keep AI commentary labelled a draft. Record product/connector costs and real owner approval as unresolved/BLOCKED; no automatic emails, public dashboard or financial certification.'
        ],
        file: 'Report quality checks',
        code: 'Missing refund -> UNRESOLVED, not zero\nDuplicate/conflicting source row -> REVIEW\nKnown omissions: fees, taxes, other adjustments\nActual filter/aggregation/access checks and source/date:\nMode: spreadsheet-only / verified private report\nConnector refresh: NOT TESTED unless observed\nReal approval BLOCKED; no public links or automatic delivery',
        check: 'You flag incomplete/duplicate data, reopen the report and distinguish observed behavior from untested connector claims.',
        aiPrompt: 'Review this report handover for missing/duplicate data, aggregation errors, misleading claims, permission risks and unknown costs. Keep commentary a draft; do not certify finances or invent refresh/approval evidence: [checks].',
        resources: [{ label: 'Data Studio documentation', url: 'https://docs.cloud.google.com/data-studio/welcome' }]
      }
    ]
  }
];
