import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const contentCreationSteps: TutorialStep[] = [
  {
    id: 'content-brief',
    title: 'Choose an audience and one message',
    explanation: [
      'Practise with Cedar Bakery, a fictional bakery, not a real client or business announcement. The exercise facts are: open Tuesday to Saturday, 08:00-14:00; bread and pastries; counter pickup. Prices, delivery and allergen information are unknown.',
      'Choose local people planning a visit as the audience and make the opening hours your main message. Use a private document and keep personal information, customer records and confidential business details out of AI prompts. No paid tool is required.'
    ],
    file: 'Content brief',
    code: 'Practice subject: fictional Cedar Bakery\nAudience: local people planning a visit\nOne message: opening hours\nExercise facts: Tuesday-Saturday, 08:00-14:00; bread and pastries; counter pickup\nUnknown: prices, delivery, allergens\nFormat: one short post\nNext step: check the opening hours in the exercise brief\nPublication: private practice only',
    check: 'Your brief identifies one audience and message, separates exercise facts from unknowns and labels the bakery fictional.',
    aiPrompt: 'Use only this fictional brief to suggest three ways to communicate its one message. List missing facts separately. Do not invent prices, delivery, allergen information or customer opinions: [brief].'
  },
  {
    id: 'content-draft',
    title: 'Draft a short post in your own voice',
    explanation: [
      'Write one 40-60-word post by hand or ask an AI assistant for a draft using only the exercise facts. Include one clear next step and make the fictional nature of the example explicit. Keep the draft private.',
      'Read the draft aloud and edit it to sound natural. AI suggestions are not evidence: remove invented offers, testimonials, guarantees or facts. Record anything you cannot verify as unknown rather than guessing.'
    ],
    file: 'Post draft',
    code: 'Practice example; fictional and not for publication:\nCedar Bakery is a fictional bakery in this exercise. It opens Tuesday to Saturday from 08:00 to 14:00 and offers bread and pastries for counter pickup. Check the exercise brief before planning a visit. This example does not describe a real business.\n\nYour draft (40-60 words):\nOne next step:\nUnverified details to remove or check:',
    check: 'Your private draft has 40-60 words, one next step and no invented facts or testimonials.',
    aiPrompt: 'Help me draft one 40-60-word post from this fictional brief. Identify it as practice, use only supplied facts, include one next step and list unknowns separately. Do not invent claims or testimonials: [brief].'
  },
  {
    id: 'content-visual',
    title: 'Plan an accessible visual or short video',
    explanation: [
      'Make a simple text-based visual for your post or plan an optional short video. A storyboard is a plan, not a finished video export. If planning video, divide 30 seconds into three scenes of 10 seconds each.',
      'Use only material you created or have permission and a suitable licence to use. Record source, owner, allowed use and any required credit; get permission before using a person’s image or voice. Add meaningful alternative text, readable contrast and, for video, checked captions and a transcript.'
    ],
    file: 'Visual and rights worksheet',
    code: 'Visual idea:\nAlternative text:\nAsset | source/owner | permission or licence | allowed use | required credit\nUnconfirmed permission: NEEDS REVIEW\n\nOptional video storyboard (not an export):\n0-10 seconds | visual | words\n10-20 seconds | visual | words\n20-30 seconds | visual | words\nCaption and transcript plan:',
    check: 'Your visual has meaningful alternative text and a rights record; any video plan has three 10-second scenes and a caption plan.',
    aiPrompt: 'Suggest an accessible text-based visual or a 30-second storyboard for this fictional post. Use only supplied facts and assets, flag unknown permissions and do not imitate a real person: [post and asset list].'
  },
  {
    id: 'content-check',
    title: 'Check facts and revise the draft',
    explanation: [
      'Compare every factual claim with the exercise brief. Keep supported details, remove false ones and mark unknowns for verification. The fictional brief does not establish Sunday opening, delivery, prices or allergens.',
      'Check spelling, plain language and readable contrast. For a video, manually correct captions and check a transcript; do not treat automatic captions as proof of accessibility. If AI helped, review its output yourself and check the destination’s current disclosure rules before any real publication.'
    ],
    file: 'Claim and accessibility check',
    code: 'Claim | evidence | decision\nTuesday-Saturday, 08:00-14:00 | exercise brief | KEEP\nOpen Sunday | contradicts brief | REMOVE\nDelivery available | unknown | REMOVE OR VERIFY\nAllergen information | unknown | DO NOT GUESS\n\nSpelling and clarity:\nVisual contrast and alternative text:\nIf video: captions and transcript checked:',
    check: 'Your claim log keeps the supported hours, removes Sunday opening and does not invent delivery or allergen information.',
    aiPrompt: 'Compare this fictional draft with the exercise brief. List each claim, its supplied evidence and whether to keep, remove or verify it. Do not guess missing information: [brief and draft].'
  },
  {
    id: 'content-review',
    title: 'Record review and permission honestly',
    explanation: [
      'Save your revised draft, claim check and asset record together. If a willing person reviews your work, ask for specific feedback and record what they actually said; remove identifying details before using AI. Do not send the exercise automatically.',
      'The fictional bakery has no real owner to approve publication. Record owner approval as BLOCKED, not approved, and do not publish the exercise. For a real project, obtain actual authorization, verify rights and resolve outstanding claims before publishing.'
    ],
    file: 'Private review log',
    code: 'Draft version:\nFacts reviewed against exercise brief:\nAsset rights and accessibility checked:\nFeedback received (only if real and permissioned):\nFictional owner approval: BLOCKED - no real owner\nUnresolved issues:\nExercise status: private; do not publish',
    check: 'Your review log contains only actual feedback, leaves fictional owner approval blocked and keeps the exercise private.',
    aiPrompt: 'Review this anonymised practice checklist for missing evidence or permissions. Do not invent feedback, owner approval or publication: [checklist].'
  },
  {
    id: 'content-next-steps',
    title: 'Plan a truthful next step',
    explanation: [
      'Choose one useful measure before a real post is published, such as the number of genuine replies, and record the source and date only when actual results exist. A single post does not prove a change caused a sale or guarantee reach.',
      'For this fictional exercise there is no publication or real audience result: leave results as NOT COLLECTED. Keep the brief, draft, visual plan, claim check and review log as your practice pack. A real project is separate and needs its own permissions and review.'
    ],
    file: 'Next-step plan',
    code: 'Practice pack: brief | draft | visual plan | claim check | review log\nFictional exercise publication: none\nReal-project measure to consider:\nActual source and date: NOT COLLECTED\nActual result: NOT COLLECTED\nWhat remains uncertain:\nOne improvement to try privately:',
    check: 'Your practice pack is complete, uncollected results are not invented and the fictional post remains unpublished.',
    aiPrompt: 'Suggest one private improvement to this practice pack. Separate actual evidence from plans, do not invent results and do not claim a post caused sales: [anonymised notes].'
  }
];
