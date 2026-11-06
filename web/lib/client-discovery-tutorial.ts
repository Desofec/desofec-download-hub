import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const clientDiscoverySteps: TutorialStep[] = [
  {
    id: 'ask-before-offering', title: '1. Understand the problem before offering work',
    explanation: [
      'Use the fictional sample-order client in the discovery lab. The opening request is vague: "Can you automate our spreadsheet and save us lots of time?" This is not a specification or evidence of savings.',
      'Ask what happens today, what fails, who is affected and what source evidence exists. Use the four supplied questions; these are scripted answers, not an AI conversation or a real interview.',
      'For real conversations, obtain permission and avoid names, recordings, credentials and confidential records. The app does not contact anyone.'
    ],
    check: 'Record at least one source-backed fact, one assumption and one unanswered question. Do not invent a measured baseline.',
    aiPrompt: 'Using only this fictional brief, suggest neutral discovery questions. Separate facts, assumptions and unknowns. Do not invent answers, budgets or savings.'
  },
  {
    id: 'define-small-scope', title: '2. Define a small delivery and clear exclusions',
    explanation: [
      'The sample delivery is one checked fictional CSV, an exception list and a short handover. A real project would need agreed limits on rows, files, revisions, formats and support.',
      'Exclude live integration, accounting certification and unlimited changes. Specify observable acceptance checks: compare source cells, preserve unknowns and reopen the output.',
      'In an existing private service project, open Client Discovery & Project Scoping and reload explicitly. It is a shared preparation tool, not a new service project type.'
    ],
    check: 'Write included work, exclusions and acceptance checks. Keep prices and deadlines unknown until discussed.',
    aiPrompt: 'Review this fictional scope for ambiguous deliverables, exclusions and acceptance checks. Ask questions rather than filling missing facts.'
  },
  {
    id: 'check-project-fit', title: '3. Check skills, capacity and risk honestly',
    explanation: [
      'Complete the six project-fit checks using actual practice evidence, not confidence alone. Unknown and No both keep the request paused.',
      'Even six Yes answers are self-recorded statements. Add supporting evidence and complete the brief; the tool only says continue scoping, never accept or approve the job.',
      'Decline or refer requests outside your competence. Do not automate safety-critical decisions, promise income or certify legal, financial, engineering or accessibility compliance.'
    ],
    check: 'Try Unknown, No and Yes. Confirm that Yes without supporting evidence still leaves the request paused.',
    aiPrompt: 'Identify missing competence, capacity, permission and human-review evidence in this fictional request. Do not recommend acceptance or claim professional approval.'
  },
  {
    id: 'confirm-access-review', title: '4. Clarify permission and the review process',
    explanation: [
      'The sample uses invented data only. Real access permission, retention, deletion, budget, deadline and reviewer availability remain unknown.',
      'Name reviewer roles, not personal details. Plan least-privilege access, manual fallback, an off switch where relevant and how access will be revoked.',
      'Do not paste client files into an AI tool or request passwords. No checklist in this app grants access or substitutes for an authorised decision.'
    ],
    check: 'Record the review role, unanswered permission questions and proposed next decision date without inventing consent.',
    aiPrompt: 'List permission and review questions for this fictional task. Do not request credentials or assume access has been authorised.'
  },
  {
    id: 'control-scope-changes', title: '5. Handle a change request without silent scope growth',
    explanation: [
      'The fictional client now asks for daily live synchronisation and unlimited revisions. This is outside the sample CSV scope.',
      'Reference the original scope version, describe the requested change, and list effects on work, dates, costs, permissions and acceptance checks. Unknown amounts stay unknown.',
      'Record the reviewer role and next decision date. The draft always says PROPOSED CHANGE - NOT ACCEPTED and never updates the original scope.'
    ],
    check: 'Create a change draft and confirm that the original scope remains unchanged. Do not record a fictional approval as real.',
    aiPrompt: 'Draft questions about the impact of this fictional change. Keep scope, price and date changes proposed, not accepted; do not invent agreement.'
  },
  {
    id: 'prepare-proposal-handoff', title: '6. Prepare a proposal without inventing agreement',
    explanation: [
      'Save discovery explicitly on your device project. Review the saved-only report before downloading. Account upload still requires separate consent from the workspace.',
      'In the project proposal builder, reload its draft and choose Start from saved discovery. Confirm replacement: it copies saved scope fields only, leaves fees and costs blank, and clears generated text so you must regenerate and inspect it.',
      'Unknowns and fit decisions stay in discovery; proposed changes are not applied. Compare both records before sharing anything manually. This is practice, not a contract or approval.'
    ],
    check: 'Confirm proposal import does not save automatically, does not fill money or approvals and does not change tests, milestones or the original discovery.',
    aiPrompt: 'Compare this fictional discovery note and draft proposal. Highlight unresolved questions and inconsistent scope; do not invent legal terms, approval or results.'
  }
];
