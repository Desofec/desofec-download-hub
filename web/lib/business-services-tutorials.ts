import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const contentServicesSteps: TutorialStep[] = [
  {
    id: 'content-service-brief',
    title: 'Agree on a small content brief',
    explanation: [
      'Practise serving a fictional bakery, not claiming a real customer. The deliverable is three short posts and a four-question FAQ, not a full marketing campaign. Ask a consenting contact what customers need to know; record actual answers separately from assumptions.',
      'Use this invented fact sheet for the exercise. Treat the opening hours and offer as fictional evidence, not facts about a real shop. Leave delivery, dietary claims and prices unknown. Do not upload contact details or confidential business information to an AI tool.'
    ],
    file: 'Content brief',
    code: 'Fictional client: Cedar Bakery\nAudience: local customers planning a visit\nApproved practice facts: open Tuesday-Saturday, 08:00-14:00; bread and pastries; collection at the counter\nUnknown: prices, delivery, allergens, special diets\nDeliverables: 3 posts (40-60 words each), 4 FAQ answers\nTone: welcoming and plain\nApproval owner: bakery owner role\nSuccess check: accurate information, not promised sales',
    check: 'Your brief separates three approved facts from unknowns and names the deliverables and reviewer.',
    aiPrompt: 'Use only this fictional brief. List missing facts and five neutral discovery questions. Do not invent customer responses, prices, dietary claims or marketing results: [brief].'
  },
  {
    id: 'content-service-draft',
    title: 'Draft a small content package',
    explanation: [
      'Write one post about visiting, one about bread and pastries, and one about counter collection. Each must contain 40-60 words and one clear next step. Draft manually or use an optional AI assistant; paid tools are not required.',
      'Write four FAQ questions: opening hours, product range, collection and allergens. The allergen answer must say the information is not confirmed and needs the owner to supply an approved answer. Do not guess safety information. Keep the draft in your own document.'
    ],
    file: 'Draft package',
    code: 'Post 1: visit and opening hours (40-60 words)\nPost 2: bread and pastries (40-60 words)\nPost 3: counter collection (40-60 words)\nEach: one next step; no unsupported benefit claim\n\nFAQ: When are you open? What do you offer? How does collection work? Where can I find allergen information?\nAllergen answer: TO CONFIRM with the owner before publication.',
    check: 'You have three distinct posts and four FAQ answers; unknown information is flagged instead of invented.',
    aiPrompt: 'Draft three 40-60-word posts and four concise FAQ answers from this approved fictional brief. Use one next step per post. Mark unsupported details TO CONFIRM, especially allergens. Do not promise sales: [brief].'
  },
  {
    id: 'content-service-quality',
    title: 'Check facts, permissions and accessibility',
    explanation: [
      'Build a claim ledger: sentence, supporting brief fact, decision and correction. Any claim about organic ingredients, guaranteed freshness, delivery, price or health needs evidence this exercise does not provide. Remove it or flag it for owner review.',
      'For each image, record that you created it or have the necessary permission/license. A simple original text graphic is sufficient. Add meaningful alt text, readable contrast and correct captions if using video. Never invent testimonials or use a person’s likeness or voice without permission.'
    ],
    file: 'Quality checks',
    code: 'Claim | brief evidence | keep / correct / remove\nOpen Sunday | brief says Tuesday-Saturday | REMOVE\nDelivery available | no evidence | REMOVE\nBread and pastries | approved practice fact | KEEP\n\nAsset | creator/license | permitted use | alt text\nNo approved asset? Use your own simple text layout.',
    check: 'Your ledger rejects Sunday opening and delivery, retains the supported product claim and documents asset permission.',
    aiPrompt: 'Audit my posts and FAQ against this fictional brief. Return a claim ledger and flag unsupported claims. Review accessibility wording without inventing image permissions: [brief and drafts].'
  },
  {
    id: 'content-service-revisions',
    title: 'Handle one controlled revision round',
    explanation: [
      'Keep version 1 and record a fictional reviewer request: move the opening hours to the first sentence and make the collection post more concise. Confirm that the request does not change the approved facts.',
      'Create version 2 with a short change log and repeat the fact/word-count checks. A request to add an unconfirmed price must stay pending, not become a published fact. Agree in the proposal how many revision rounds and deliverables are included; do not silently accept unlimited changes.'
    ],
    file: 'Revision log',
    code: 'Version | request | approved fact affected? | action | reviewer\nv1 -> v2 | hours first | no change | reorder and recheck | owner role\nv1 -> v2 | shorter collection post | no change | keep 40-60 words | owner role\nPending | add a price | price unknown | ask for verified price | owner role\nIncluded revisions: one round for this practice package',
    check: 'You preserve both versions, log the edits and leave the unknown price out of the approved copy.',
    aiPrompt: 'Apply only these approved revisions. Preserve the facts and keep each post within 40-60 words. List changes and leave the price request pending: [brief, v1, requests].'
  },
  {
    id: 'content-service-offer',
    title: 'Cost and describe the service honestly',
    explanation: [
      'Use the proposal builder for scope, exclusions, owner approval and delivery terms. Offer drafts and one revision round, not automatic publishing or guaranteed traffic. Record time spent drafting, checking, revising and handing over.',
      'Illustrative arithmetic: 1 hour briefing + 2 drafting + 1 checking + 1 revision/handover = 5 hours. At an internal planning allowance of EUR 20/hour, labour is EUR 100 before expenses, taxes and overhead. This is not a market rate, price recommendation or profit. Enter a proposed fee separately and validate willingness to pay.'
    ],
    file: 'Offer worksheet',
    code: 'Scope: 3 posts + 4 FAQ answers + one revision round\nExcluded: posting, ad spend, sales guarantees, unverified claims\nInternal planning: (1 + 2 + 1 + 1) x EUR 20 = EUR 100\nAdditional costs / taxes / overhead: TO CONFIRM\nProposed fee: separately chosen, not the cost subtotal\nDelivery: only after owner approves facts and assets',
    check: 'Your offer states the scope and exclusions and distinguishes EUR 100 internal labour from a selling price.',
    aiPrompt: 'Review this service scope for unclear deliverables, revision limits and unsupported promises. Check arithmetic, but do not invent a market price or client demand: [worksheet].'
  },
  {
    id: 'content-service-handoff',
    title: 'Deliver a reviewed package and learn from feedback',
    explanation: [
      'Create a delivery folder with final copy, the approved brief, asset-permission ledger, alt text and revision log. Open every file and remove unresolved claims before marking it ready. A real customer must approve publication separately.',
      'Use the results tracker to record four checks: facts match the brief, post word counts pass, permissions are documented and owner approval exists. A fictional exercise has no real owner approval: mark that check blocked rather than inventing it. Decide continue, revise or stop from actual feedback, not claimed sales.'
    ],
    file: 'Handover',
    code: '01-approved-brief\n02-final-posts-and-faq\n03-assets-and-alt-text\n04-revision-log\n\nChecks: facts / word counts / permissions / owner approval\nUnknown approval: BLOCKED, not PASS\nNext action and evidence needed:\nDecision: continue / revise / stop',
    check: 'Your package opens correctly, contains the review records and does not present fictional approval or sales as real.',
    aiPrompt: 'Check my anonymised delivery checklist for missing evidence and unresolved claims. Do not invent owner approval or campaign results: [checklist].'
  }
];

export const cadServicesSteps: TutorialStep[] = [
  {
    id: 'cad-service-boundaries',
    title: 'Choose a non-functional concept service',
    explanation: [
      'This path practises a display-card concept: a rectangle 80 mm wide, 40 mm high and 3 mm thick. It is not a load-bearing part, machine component or validated manufacturing design. Complete Design & CAD Basics first if you have never sketched or modelled.',
      'The client deliverable is a clearly labelled concept sketch, dimensioned views and a presentation image. AI may help explain commands or draft documentation; it does not certify dimensions, strength, fit or safety. Do not use proprietary drawings or customer files without authorisation.'
    ],
    file: 'Concept-only brief',
    code: 'Fictional project: plain display-card concept\nUnits: mm\nWidth 80; height 40; thickness 3\nNo holes, text, fit requirements or assembly\nDeliverables: concept sketch + dimensioned views + presentation image\nExcluded: fabrication, structural analysis, safety approval\nLabel every page: CONCEPT ONLY - NOT FOR MANUFACTURE',
    check: 'Your brief states units and three dimensions, and excludes fabrication and engineering approval.',
    aiPrompt: 'Turn this fictional non-functional concept brief into a requirements checklist. Do not add tolerances, material claims, load ratings or manufacturing approval: [brief].'
  },
  {
    id: 'cad-service-sketch',
    title: 'Sketch and reconcile the dimensions',
    explanation: [
      'Draw a front rectangle 80 by 40 mm and a side rectangle 3 by 40 mm on paper or in a sketch tool. Label units and dimensions. At a 1:2 paper scale, the front measures 40 by 20 mm on the page but its dimension labels still describe the actual 80 by 40 mm concept.',
      'Check the aspect ratio: 80/40 = 2. A plain rectangular solid has volume 80 x 40 x 3 = 9600 cubic mm. This is a geometric check, not a material, strength or manufacturing calculation.'
    ],
    file: 'Dimension worksheet',
    code: 'Front: 80 x 40 mm\nSide: 3 x 40 mm\nTop: 80 x 3 mm\nFront aspect ratio: 2:1\nPlain-solid volume: 9600 mm^3\nAt paper scale 1:2: front drawn 40 x 20 mm\nAll dimension labels retain actual dimensions.',
    check: 'Your three views agree on width, height and thickness, and your calculation gives 9600 cubic mm.',
    aiPrompt: 'Check these three-view dimensions and simple rectangular volume by arithmetic. Flag conflicts without inventing tolerances or certifying the concept: [worksheet].'
  },
  {
    id: 'cad-service-model',
    title: 'Build the plain concept or a paper mock-up',
    explanation: [
      'If using CAD, create a new design in millimetres, sketch an 80 by 40 mm rectangle and extrude it by 3 mm. Inspect dimensions using the tool’s measurement features. Do not use a generated image as proof of accurate geometry.',
      'No paid tool is required for the worksheet: a labelled paper mock-up can document the concept, but it is not a CAD deliverable. Check current tool licensing before commercial work. A personal-use CAD license may exclude paid client projects; do not assume eligibility or upload private designs to a public workspace.'
    ],
    file: 'Build record',
    code: 'Method: CAD model / paper mock-up (state honestly)\nCAD: units mm -> sketch 80 x 40 -> extrude 3\nMeasured width / height / thickness:\nIf plain solid: compare volume to 9600 mm^3\nNative file or sketch location:\nLicense and sharing eligibility checked before commercial use:\nStatus: CONCEPT ONLY - NOT FOR MANUFACTURE',
    check: 'You measured the concept or clearly labelled a paper-only alternative; you do not claim a mock-up is a completed CAD file.',
    aiPrompt: 'Explain how to sketch and extrude this plain rectangle in [my CAD tool]. Ask which version I use, avoid guessed menu names, and keep it concept-only: [brief].'
  },
  {
    id: 'cad-service-review',
    title: 'Review views, exports and a revision',
    explanation: [
      'Create front, top and side views with readable units and dimensions. Export a PDF/image for review; if you made a CAD model, keep the native file and only export a neutral format when the agreed tool supports it. Reopen exports to check for missing dimensions or changed scale.',
      'For a controlled revision, change the width from 80 to 90 mm while retaining height 40 and thickness 3. The new aspect ratio is 2.25 and the plain-solid volume is 10800 cubic mm. Save version 2, preserve version 1 and update every view. Do not invent tolerances or call the document production-ready.'
    ],
    file: 'Revision evidence',
    code: 'v1: 80 x 40 x 3 mm; volume 9600 mm^3\nv2: 90 x 40 x 3 mm; volume 10800 mm^3\nv2 front aspect ratio: 2.25:1\nChecks: all views updated; units retained; export reopened\nEvidence: dimensions/measurements, not just a rendering\nBoth versions: CONCEPT ONLY - NOT FOR MANUFACTURE',
    check: 'Version 2 has width 90 in every view, the other dimensions unchanged, and the geometric check gives 10800 cubic mm.',
    aiPrompt: 'Compare this revision record with the concept requirements. Identify inconsistent views and missing labels. Do not add a compliance or manufacturing claim: [record].'
  },
  {
    id: 'cad-service-offer',
    title: 'Scope the concept service and its review needs',
    explanation: [
      'Use the proposal builder to define a concept-only package with one revision round, file formats, software compatibility and who reviews it. Exclude fabrication, structural calculations, regulated design and engineering sign-off.',
      'Record time and licensing costs separately from the proposed fee. For actual functional engineering work, requirements and verification must be defined and approved by an appropriately qualified professional. Do not accept work beyond your competence or treat AI output as that approval.'
    ],
    file: 'Concept service offer',
    code: 'Included: concept sketch, dimensioned concept views, one presentation image, one revision\nDelivery method/file formats:\nExcluded: functional design, manufacture, load ratings, safety/compliance sign-off\nInternal time, licensing and overhead:\nProposed fee: separately chosen\nAuthorised reviewer and approval route:\nUnresolved requirements: TO CONFIRM',
    check: 'Your offer promises only the concept deliverables you can demonstrate and identifies when professional review is needed.',
    aiPrompt: 'Review this concept-service proposal for scope ambiguity, licensing assumptions and unsupported engineering claims. Do not certify the design: [offer].'
  },
  {
    id: 'cad-service-handoff',
    title: 'Deliver a labelled, traceable concept package',
    explanation: [
      'Package the brief, versioned sketch/model, exported views, measurement evidence and change log. Label every exported page CONCEPT ONLY - NOT FOR MANUFACTURE. State whether the package is CAD or paper-only, and list software/version and units.',
      'Use the results tracker for dimension consistency, export reopening, revision completeness and required review. Missing qualified or customer approval is blocked, never assumed passed. Do not fabricate, install or operate a part based on this exercise.'
    ],
    file: 'Concept handover',
    code: 'Brief | native file or paper sketch | views | measurements | change log\nMethod and software/version:\nUnits: mm\nVersion delivered:\nConcept-only label on every page:\nChecks and unresolved review:\nDecision: revise / stop / continue concept discussion only',
    check: 'Your handover is traceable, honest about its format and visibly not a manufacturing release.',
    aiPrompt: 'Check this handover list for missing units, version labels, evidence and exclusions. Keep any decision limited to a concept discussion: [list].'
  }
];

export const microSaasSteps: TutorialStep[] = [
  {
    id: 'saas-problem-evidence',
    title: 'Validate one narrow recurring problem',
    explanation: [
      'A micro-SaaS is a small subscription software service; this path validates an idea before building a live service. The practice idea formats a short project update from a project name and status. It does not analyse a business or generate technical advice.',
      'Ask consenting adults how they currently prepare updates, how often and what is frustrating. Record actual evidence and uncertainty. If you have not interviewed anyone, label demand unvalidated. Do not buy hosting, collect payments or promise recurring revenue based on the exercise.'
    ],
    file: 'Problem evidence',
    code: 'Idea: simple project-update formatter\nTarget user and recurring task:\nCurrent method, frequency and pain:\nEvidence source/date (anonymised):\nAssumptions still unvalidated:\nNext neutral interview question:\nNo interview yet: demand UNVALIDATED',
    check: 'Your problem brief distinguishes observed need from guesses and does not claim paying users.',
    aiPrompt: 'Write five neutral discovery questions for this narrow problem. Do not invent interview answers, subscribers or market size: [brief].'
  },
  {
    id: 'saas-scope',
    title: 'Define a testable manual service first',
    explanation: [
      'Specify two fields: Project (1-40 characters) and Status (Draft or Review). The output is exactly Project: [name] on the first line and Status: [choice] on the second. An empty or overlong name is rejected. No AI is needed to format these facts.',
      'Test the service manually in a document before coding. Exclude login, payments, customer uploads, AI generation, storage and integrations. If real users need different behaviour, record it as a new hypothesis rather than expanding the prototype silently.'
    ],
    file: 'Formatter specification',
    code: 'Input: project name (trimmed, 1-40 characters); status Draft or Review\nOutput example:\nProject: Atlas\nStatus: Review\n\nRejected: blank name; more than 40 characters\nExcluded: login, payments, AI API, storage, network calls\nGoal: test whether the small output is useful, not launch a subscription',
    check: 'Your manual prototype produces the exact two-line Atlas example and has clear rejection rules.',
    aiPrompt: 'Review this specification for ambiguity and unnecessary features. Explain why deterministic formatting does not need an AI API: [spec].'
  },
  {
    id: 'saas-local-prototype',
    title: 'Build a local-only toy prototype',
    explanation: [
      'Copy the full HTML below into a plain-text file named formatter.html and open it in a browser. Use fictional names only. It has no network calls, login or saved data. You can use the manual version if you are not ready to edit HTML, but record that you have not tested the code version.',
      'Change Project and Status, then press Format update. The output uses textContent, not HTML insertion, so typed markup is displayed as text. AI help is optional; do not connect an API or deploy a subscription product for this exercise.'
    ],
    file: 'formatter.html',
    code: '<!doctype html>\n<html lang="en">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Fictional update formatter</title>\n<main>\n<h1>Fictional update formatter</h1>\n<p>Local practice only. No storage or network calls.</p>\n<form id="update-form" novalidate>\n<label for="project">Project (1-40 characters)</label>\n<input id="project" maxlength="40">\n<label for="status">Status</label>\n<select id="status"><option>Draft</option><option>Review</option></select>\n<button>Format update</button>\n</form>\n<pre id="output" role="status"></pre>\n</main>\n<script>\nconst form = document.getElementById("update-form");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const name = document.getElementById("project").value.trim();\n  const status = document.getElementById("status").value;\n  const output = document.getElementById("output");\n  if (!name || name.length > 40 || !["Draft", "Review"].includes(status)) {\n    output.textContent = "Enter a project name (1-40 characters) and a valid status.";\n    return;\n  }\n  output.textContent = `Project: ${name}\\nStatus: ${status}`;\n});\n</script>\n</html>',
    check: 'The file opens locally and formats Atlas / Review into exactly two lines without sending or storing data.',
    aiPrompt: 'Explain this toy HTML one section at a time. Preserve textContent and the input checks; do not add dependencies, network calls or storage: [code].'
  },
  {
    id: 'saas-test-costs',
    title: 'Test boundaries and record costs honestly',
    explanation: [
      'Record five cases in the results tracker: Atlas/Review, a blank name, a 40-character name, a 41-character name forced through browser developer tools, and markup entered as a name. The last must remain literal text, not an element. Record actual results; a manual-only prototype cannot prove the browser checks passed.',
      'This local toy has no hosting or API bill but still costs your time. For a future service, list hosting, API usage, monitoring, support, payment processing, tax and other overhead as unknown until verified. A subscription fee is not profit; do not project lifetime income from a tiny test.'
    ],
    file: 'Prototype checks',
    code: 'Atlas + Review -> Project: Atlas\\nStatus: Review\nBlank name -> visible error\n40 characters -> accepted\n41 characters forced into input -> visible error\n<b>Atlas</b> -> literal text, no bold element\n\nActual results/evidence:\nPrototype method: browser / manual\nFuture operating costs and support: TO CONFIRM',
    check: 'You have five recorded cases with evidence, or openly mark browser-only cases not run, and list unverified future costs.',
    aiPrompt: 'Review these test results and cost assumptions. Identify missing evidence; do not invent passing results, pricing or future revenue: [record].'
  },
  {
    id: 'saas-user-validation',
    title: 'Observe use and test willingness to try',
    explanation: [
      'Invite a consenting tester to try a fictional update and ask what they expected, what confused them and whether this solves a recurring problem. Do not lead with a price or tell them it saves time before measuring. A compliment is not a paid commitment.',
      'Use the proposal builder only for a clearly scoped discovery/prototype pilot, not a ready-to-buy subscription. If payment interest emerges, record exactly what was agreed without collecting money in this exercise. Real billing, privacy, access control, refunds and maintenance need separate design and review.'
    ],
    file: 'Validation interview',
    code: 'Task attempted:\nObserved behaviour and confusion:\nCurrent alternative:\nWould try again? Actual response:\nEvidence of recurring need:\nWillingness to pay: UNVALIDATED unless directly supported\nNo subscriptions, payment details or personal data collected.',
    check: 'You separate observed use, stated interest and actual commitment, without inventing paying customers.',
    aiPrompt: 'Summarise only these anonymised observations. Separate behaviour, opinions, assumptions and unvalidated payment interest: [notes].'
  },
  {
    id: 'saas-decision',
    title: 'Decide before building a live micro-SaaS',
    explanation: [
      'Review the problem evidence, five prototype tests, feedback, time spent and unknown costs. Choose continue discovery, revise the idea or stop. A continue decision does not mean the product is secure, compliant or production-ready.',
      'Before any real launch, create a separate plan for authentication, permissions, data retention/deletion, billing, support, security review and failure recovery. The advanced web-development path can help with engineering practice; it does not replace professional review where required.'
    ],
    file: 'Validation decision',
    code: 'Problem evidence:\nPrototype test gaps:\nObserved usefulness and uncertainty:\nCost and support unknowns:\nDecision: continue discovery / revise / stop\nNext evidence needed, owner and review date:\nProduction features deliberately NOT built:',
    check: 'Your decision is supported by evidence and states the gaps between a local toy and a real subscription service.',
    aiPrompt: 'Audit my validation decision for unsupported demand and readiness claims. List what must be investigated before a live product, without inventing traction: [decision].'
  }
];

export const educationServicesSteps: TutorialStep[] = [
  {
    id: 'education-service-audience',
    title: 'Define an adult learning service',
    explanation: [
      'Practise a 15-minute introductory workshop for consenting adults on checking AI-generated claims. Do not start with children, personal student records, automated grading or high-stakes certification. Ask what learners already know and what task they need to practise.',
      'The learning objective is observable: by the end, a learner distinguishes a supported claim, an unsupported claim and a safe next verification step using the supplied fact sheet. This is not a promise of employment or professional qualification.'
    ],
    file: 'Workshop brief',
    code: 'Audience: consenting adult beginners\nDuration: 15 minutes\nTopic: check claims against a supplied fact sheet\nObjective: identify support, flag unknowns and propose verification\nMaterials: fictional fact sheet, two draft claims, answer key\nExcluded: certification, personal records, automated grading\nFacilitator and review role:',
    check: 'Your brief names adult learners, a measurable objective and clear exclusions.',
    aiPrompt: 'Review this adult workshop objective for clarity and measurability. Do not invent learner needs, credentials or guaranteed outcomes: [brief].'
  },
  {
    id: 'education-service-materials',
    title: 'Create a short lesson and original materials',
    explanation: [
      'Use this invented community workshop fact sheet: the session starts at 10:00, lasts 30 minutes and has 12 seats. Prepare your own accessible slide or handout. Do not copy a paid course, licensed assessment or another creator’s materials without permission.',
      'Plan 3 minutes to explain evidence, 5 for guided practice, 4 for independent practice and 3 for discussion: 15 minutes total. AI can suggest wording, but you must verify each claim against the fact sheet. Keep printed or text-only materials available.'
    ],
    file: 'Lesson plan',
    code: 'Fictional fact sheet: start 10:00; duration 30 minutes; capacity 12 seats\n3 min: explain supported versus unsupported claims\n5 min: guided check - "The session starts at 10:00."\n4 min: independent check - "Everyone receives a certificate."\n3 min: compare reasoning and ask how to verify unknowns\nTotal: 15 minutes\nMaterials: original handout + readable text alternative',
    check: 'The timings sum to 15 and the handout includes the fact sheet without invented certificate information.',
    aiPrompt: 'Draft a plain-language handout from this fictional fact sheet and 15-minute plan. Do not add prices, certificates or facts not supplied. Keep source facts separate from example claims: [plan].'
  },
  {
    id: 'education-service-answer-key',
    title: 'Verify the answer key and assessment',
    explanation: [
      'Check three claims: starts at 10:00 is supported; lasts 60 minutes contradicts the supplied 30 minutes; everyone receives a certificate is unknown. A safe next step for the last claim is asking the organiser for verified policy, not letting AI guess.',
      'Use a four-point practice rubric: one point for correctly supporting 10:00, one for correcting 60 to 30 minutes, one for flagging the certificate claim as unknown, and one for proposing a real verification step. Score manually and explain reasoning; do not imply this small exercise proves broader competence.'
    ],
    file: 'Answer key and rubric',
    code: 'Start 10:00 -> supported (1 point)\nDuration 60 minutes -> contradicted; fact sheet says 30 (1 point)\nCertificate for everyone -> unknown (1 point)\nNext step -> ask organiser/check verified policy (1 point)\nPractice total: 0-4, not a qualification\nA blank answer is missing evidence, not proof of inability.',
    check: 'Your answer key has three correct classifications and four independent scoring criteria.',
    aiPrompt: 'Check this answer key against the fictional fact sheet. Explain each classification and flag unsupported scoring claims. Do not grade real learners or infer ability: [sheet and rubric].'
  },
  {
    id: 'education-service-trial',
    title: 'Run a consent-based accessibility trial',
    explanation: [
      'Rehearse alone first, then optionally invite consenting adults. Explain the purpose, duration and voluntary nature. Do not collect names, recordings, sensitive information or personal learning records for this exercise. If no tester is available, mark the learner trial not run.',
      'Offer large readable text, plain language and an alternative to speaking aloud. Check keyboard access for digital materials and read the exercise without relying on colour alone. Record only non-identifying observations such as unclear wording or an activity taking longer than planned.'
    ],
    file: 'Trial observations',
    code: 'Rehearsal actual duration:\nAdult trial: not run / consent confirmed\nText-only alternative available:\nInstructions understood? Evidence without identifiers:\nAccessibility issue and correction:\nRubric clarity issue:\nNo learner names, scores or recordings retained.',
    check: 'You honestly distinguish rehearsal from a real trial and record accessibility issues without personal learner data.',
    aiPrompt: 'Review these anonymous material-level observations for confusing instructions and accessibility barriers. Do not infer learner diagnoses or ability: [notes].'
  },
  {
    id: 'education-service-offer',
    title: 'Package and cost a small workshop service',
    explanation: [
      'Use the proposal builder to scope one 15-minute adult workshop, an original handout, a manually checked answer key and one material-revision round. State what is excluded: certification, learner profiling, real-record processing and guaranteed results.',
      'Record preparation, rehearsal, delivery, revision and accessible-format time, plus venue/tool expenses and relevant overhead. Choose a proposed fee separately; no paid AI is required. Check permissions, venue rules and appropriate local requirements before offering a real service.'
    ],
    file: 'Education service scope',
    code: 'Included: 15-minute adult session, original handout, answer key, one material revision\nDelivery format and access needs:\nPreparation / rehearsal / delivery / revision time:\nExpenses, overhead and tax assumptions:\nProposed fee: separate from costs\nExcluded: credentials, learner profiling, guaranteed outcomes\nReviewer and acceptance checks:',
    check: 'Your offer lists measurable deliverables and support limits without presenting practice as an accredited course.',
    aiPrompt: 'Review this workshop offer for unsupported educational claims, unclear access arrangements and missing preparation costs. Do not invent accreditation or demand: [scope].'
  },
  {
    id: 'education-service-review',
    title: 'Deliver materials and improve from evidence',
    explanation: [
      'Package the brief, lesson plan, fact sheet, handout, checked key, accessibility notes and version log. A second adult reviewer can check materials against the source; if they have not done so, mark review pending.',
      'Use the results tracker to record factual accuracy, timing, accessible alternatives and rubric consistency. Keep feedback about materials, not personal learner profiles. Decide continue, revise or stop; a 0-4 practice rubric does not justify claims about long-term learning or job outcomes.'
    ],
    file: 'Workshop handover',
    code: 'Brief | 15-minute plan | original handout | fact sheet | checked key\nAccessibility alternatives and version:\nChecks: source accuracy / timing / access / rubric consistency\nIndependent review: pending unless actually completed\nMaterial-level feedback and uncertainty:\nDecision and next revision:',
    check: 'Your package is reproducible and honest about any missing trial or review, without collecting learner profiles.',
    aiPrompt: 'Audit this handover checklist for missing sources, access alternatives and review evidence. Do not invent learner improvement or accreditation: [checklist].'
  }
];
