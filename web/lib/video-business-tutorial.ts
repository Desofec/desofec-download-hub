import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const videoBusinessSteps: TutorialStep[] = [
  {
    id: 'video-business-brief',
    title: 'Plan short-form business videos',
    explanation: [
      'Create a practice package for fictional Cedar Bakery: three vertical videos about visiting, bread and pastries, and counter collection. Each finished video must be 15-30 seconds at 1080 x 1920 pixels (9:16). These are exercise requirements, not universal social-platform rules.',
      'Use only the supplied fictional facts. Prices, delivery, allergens and commercial results are unknown. No real client, automatic publication or paid AI is required. Choose an editor you can access; original text slides are a valid video alternative. A storyboard alone is not a finished video.'
    ],
    file: 'Video brief',
    code: 'FICTIONAL PRACTICE - NOT APPROVED FOR PUBLICATION\nCedar Bakery: Tuesday-Saturday, 08:00-14:00; bread and pastries; counter collection\nUnknown: prices, delivery, allergens, sales results\nVideos: visit / products / collection\nEach export: 15-30 seconds inclusive; 1080 x 1920; 9:16\nIncluded: scripts, storyboards, captions, three exports, one revision round\nExcluded: posting, ads, guaranteed views or sales, cloned voices and likenesses',
    check: 'Your brief names all three videos, the duration and resolution, supported facts, unknowns and review owner.',
    aiPrompt: 'Plan three distinct short-form videos using only this fictional brief. Separate facts from unknowns. Do not invent prices, testimonials, sales or approval: [brief].'
  },
  {
    id: 'video-business-scripts',
    title: 'Write AI video scripts and storyboards',
    explanation: [
      'Give each video one message and one next step. Use a three-scene 20-second plan: opening 0-4 seconds, main message 4-14, next step 14-20. Draft manually or use an optional AI assistant. Read narration aloud and measure actual timing; word count alone cannot establish runtime.',
      'Make an asset list beside the storyboard. Use original text graphics or authorised assets. An AI-generated bakery image is an illustration, not a photograph of a real business or its products. Do not imitate an identifiable person, invent customer endorsements or clone a voice.'
    ],
    file: 'Script and storyboard worksheet',
    code: 'Video 1 - Visit (20-second plan)\n0-4: Planning a bakery visit? | original title card\n4-14: Fictional Cedar Bakery opens Tuesday-Saturday, 08:00-14:00. | readable hours\n14-20: Check the opening hours before your visit. | next-step card\n\nVideo 2: bread and pastries; no dietary or price claims\nVideo 3: counter collection; no delivery claim\nFor each: scene timing / narration or on-screen text / asset / captions\nActual read-through duration: measure, do not guess\nLabel: fictional practice; identify any AI-generated illustration',
    check: 'You have three distinct scripts with timed scenes and a claim/asset list; no unknown business detail becomes a fact.',
    aiPrompt: 'Draft three 20-second scripts with timed scenes, on-screen text and caption text. Use only the supplied facts; label generated visuals as illustrations. Timing must be checked by me: [brief].'
  },
  {
    id: 'video-business-edit',
    title: 'Edit AI-assisted videos and captions',
    explanation: [
      'In your chosen editor, create a 1080 x 1920 vertical project. Build the three videos from your storyboard using original slides, permissioned footage or optional generated clips. Check current export, watermark, credit and commercial-use terms before paying. Never assume a free plan permits a particular export.',
      'Correct automatic captions word by word against the actual narration, including names and opening hours. Keep essential text readable and away from interface overlays; preview on a phone. Watch with sound off and check any meaningful audio has a text alternative. For silent text slides, record no narration and verify the complete on-screen message instead.'
    ],
    file: 'Edit and caption record',
    code: 'Video / editor and version / method: slides, footage or AI-assisted\nTimeline size: 1080 x 1920\nActual export duration / resolution:\nCaption correction / source narration / timestamp:\nSilent version: no narration; complete readable text checked\nPhone preview / sound-off observation / correction:\nGenerated asset defects and missing permissions:\nStoryboard-only: export checks BLOCKED, not PASS',
    check: 'Each actual export has measured duration and resolution; captions or complete silent-video text are checked, not merely generated.',
    aiPrompt: 'Compare this caption text with my script and flag wording mismatches. Suggest plain-language corrections without claiming to have watched my external video: [script and captions].'
  },
  {
    id: 'video-business-review',
    title: 'Check video quality, permissions and revisions',
    explanation: [
      'Watch every exported file from beginning to end. Verify each is 15-30 seconds inclusive and 1080 x 1920; do not rely only on timeline settings. Review text, narration, image defects, music licensing, attribution and any AI disclosure required by the intended platform. There is no universal permission or disclosure rule.',
      'Preserve version 1. For one controlled revision, move the opening hours earlier in the visit video and improve caption readability. Keep a change log, then reopen all version 2 exports and repeat the checks. A fictional request to add a price remains pending until a real authorised source supplies it; the exercise provides no price.'
    ],
    file: 'Version and permissions ledger',
    code: 'Asset / creator / source / permitted use / attribution / checked date\nNo permission evidence: replace with original work or BLOCK\nVersion / request / change / repeated check / remaining gap\nv1 -> v2: hours earlier; captions easier to read; recheck duration and facts\nPending: add price - unknown, do not include\nExports: reopen all three v2 files; measure each\nActual owner approval: unavailable in fictional exercise, BLOCKED',
    check: 'Your ledger preserves both versions, rejects the unknown price and records actual export checks and permission gaps.',
    aiPrompt: 'Audit this video claim and permissions ledger against the fictional brief. Flag gaps without inventing licences, platform rules or owner approval: [ledger].'
  },
  {
    id: 'video-business-offer',
    title: 'Scope and cost a business video service',
    explanation: [
      'Use the project proposal builder for three videos, scripts, captions, agreed file formats and one revision round. Name the review owner, delivery timeline, asset permissions and data handling. Exclude posting, ad management, unlimited revisions, guaranteed views and sales. A learning package is not evidence that clients will pay.',
      'Record actual time and vendor credits separately from the proposed fee. Illustrative internal planning only: 1 hour briefing + 2 scripts/editing + 1 checks + 1 revision/handover = 5 hours; at EUR 20/hour that is EUR 100 before tool costs, taxes and overhead. This is not a market rate, recommended price or profit. Unknown costs remain unknown.'
    ],
    file: 'Video service offer',
    code: 'Included: three 15-30-second 1080 x 1920 videos, scripts, captions, one revision\nExcluded: posting, ads, guarantees, unlicensed assets, voice cloning\nReviewer / timeline / formats / AI and asset disclosure:\nData: fictional only; no confidential files or personal details in AI prompts\nInternal example: (1 + 2 + 1 + 1) x EUR 20 = EUR 100\nActual time / vendor credits / licences / taxes / overhead:\nProposed fee: separate and unvalidated\nPublication: only after required real approval and permissions',
    check: 'Your proposal separates deliverables, internal costs and proposed fee, with review, timeline and data boundaries.',
    aiPrompt: 'Review this business video offer for scope, revision limits, arithmetic and unsupported promises. Do not invent demand, pricing or earnings: [offer].'
  },
  {
    id: 'video-business-handover',
    title: 'Prepare a private video service handover',
    explanation: [
      'Keep scripts, caption text, versioned exports, the brief, permission ledger and change log in your own storage. Save text records in the private project workbook; Desofec does not upload, render, generate or inspect video files. Do not put credentials or confidential client material in these records.',
      'Reload the project results draft and explicitly load the seven VIDEO test plans. Record actual evidence and honest outcomes. A storyboard-only package cannot pass export checks; missing real owner approval stays blocked. Review saved text in the Review Centre, record a decision and download a private practice portfolio only after checking it. Continue means more practice or discovery, not publication approval.'
    ],
    file: 'Video handover checklist',
    code: '01-fictional-brief\n02-scripts-storyboards-captions\n03-v1-and-v2-exports (or explicitly storyboard-only)\n04-assets-permissions-and-disclosure\n05-revision-log\n06-measured-checks-and-open-issues\n\nVIDEO-1 facts; VIDEO-2 exports; VIDEO-3 captions; VIDEO-4 permissions\nVIDEO-5 revisions; VIDEO-6 costs and boundaries; VIDEO-7 owner approval\nDecision: continue practice / revise / stop\nFictional practice is not verified client work or permission to publish.',
    check: 'Your handover distinguishes actual videos from plans, retains unresolved checks and never invents owner approval.',
    aiPrompt: 'Check this private practice handover for missing scripts, captions, versions, permission evidence and blocked approval. Do not claim to inspect external files: [checklist].'
  }
];
