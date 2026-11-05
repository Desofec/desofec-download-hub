import { projectProposalReady, type PilotProject } from '@/lib/pilot-projects';
import { effectiveTestStatus, resultTestSummary, testHasEvidence } from '@/lib/pilot-results';

export const firstContentPath = 'ai-content-services';

export const contentJourneyStages = [
  {
    id: 'learn', title: '1. Learn the brief',
    instruction: 'Read lesson 1. In Practice objective and evidence, separate the fictional bakery facts from unknowns. Check the facts-and-assumptions project item only after reviewing them.',
    action: 'Review the lesson and save the facts-and-assumptions brief.',
    link: 'Open the content tutorial', destination: 'tutorial'
  },
  {
    id: 'practise', title: '2. Practise the content package',
    instruction: 'Use lessons 2-4 and the kit to create three 40-60-word posts, four FAQ answers, a claim/asset ledger and a revision log in your own files. Describe deliverables, exclusions and pending owner review in the brief, then check the scope item.',
    action: 'Prepare the practice files, then save scope and review boundaries.',
    link: 'Open the content kit', destination: 'kit'
  },
  {
    id: 'draft', title: '3. Draft the service proposal',
    instruction: 'Open the project proposal builder, reload its draft and optionally start from the brief. Define the problem, scope, exclusions, checks, review role and handover. Generate, review and save the draft to this project. Unknown fees may remain blank.',
    action: 'Save a current proposal with scope, exclusions, checks and review terms.',
    link: 'Build a pilot proposal', destination: 'proposal'
  },
  {
    id: 'test', title: '4. Test and record evidence',
    instruction: 'Record at least four distinct checks: brief facts, post word counts, asset permissions and owner approval. Include input, expected and actual evidence for each. Mark unavailable real approval blocked, not passed. Save results and check the evidence item.',
    action: 'Record four distinct checks with actual evidence and honest outcomes.',
    link: 'Track pilot tests and results', destination: 'results'
  },
  {
    id: 'review', title: '5. Record a review decision',
    instruction: 'Choose continue, revise or stop yourself. Record your reasoning, uncertainty and next steps, then check the review item. Failed or blocked tests can be documented learning; they never become approval to publish.',
    action: 'Save a reasoned decision, remaining uncertainty and next actions.',
    link: 'Track pilot tests and results', destination: 'results'
  },
  {
    id: 'handover', title: '6. Assemble the practice portfolio',
    instruction: 'Keep versioned copy, the practice fact sheet, claim/asset ledger and revision log in your own files. Review the saved record and check the handover item. Preview a private practice portfolio; download only after reviewing its contents.',
    action: 'Review the saved record, check handover and preview your private portfolio.',
    link: 'Review brief and checklist', destination: 'brief'
  }
] as const;

export function contentJourney(project: PilotProject) {
  const proposal = project.proposal;
  const tests = project.results?.tests ?? [];
  const recorded = tests.filter((test) => testHasEvidence(test) && effectiveTestStatus(test) !== 'pending');
  const distinct = new Set(recorded.map((test) => test.name.trim().toLowerCase()));
  const notes = project.results?.notes;
  const ownChecks = [
    Boolean(project.brief.objective.trim() && project.completed.includes('brief')),
    Boolean(project.brief.scope.trim() && project.brief.review.trim() && project.completed.includes('scope')),
    Boolean(projectProposalReady(project) && proposal && ([
      'title', 'problem', 'scope', 'exclusions', 'acceptance', 'reviewer', 'handover'
    ] as const).every((key) => proposal.inputs[key].trim())),
    distinct.size >= 4 && project.completed.includes('evidence'),
    Boolean(project.results?.decision && notes?.rationale.trim() && notes.uncertainty.trim()
      && notes.nextSteps.trim() && project.completed.includes('review')),
    project.completed.includes('handover')
  ];
  let previousComplete = true;
  const stages = contentJourneyStages.map((stage, index) => {
    const complete = previousComplete && ownChecks[index];
    previousComplete = complete;
    return { ...stage, complete };
  });
  const next = stages.find((stage) => !stage.complete);
  return {
    stages, next, ready: !next,
    recordedChecks: distinct.size,
    summary: project.results ? resultTestSummary(tests) : null
  };
}

export function contentJourneyHref(project: PilotProject, destination: typeof contentJourneyStages[number]['destination']) {
  switch (destination) {
    case 'tutorial': return '/tutorials/ai-content-services';
    case 'kit': return '/starter-packs/ai-content-services-kit';
    case 'proposal': return `/business-launchpad/proposal-builder?project=${encodeURIComponent(project.id)}`;
    case 'results': return `/business-launchpad/results-tracker?project=${encodeURIComponent(project.id)}`;
    case 'brief': return '#project-brief-form';
  }
}

export function buildContentPortfolio(project: PilotProject, tr: (text: string) => string) {
  if (project.pathId !== firstContentPath) throw new Error('This guided portfolio is available for AI Content Services projects only.');
  const journey = contentJourney(project);
  const unknown = tr('[TO CONFIRM]');
  const decision = project.results?.decision;
  return [
    tr('PRACTICE PORTFOLIO - FICTIONAL CONTENT SERVICE, NOT CLIENT WORK'),
    tr(journey.ready ? 'Practice record assembled - self-recorded, not independently verified.' : 'Incomplete practice draft - milestones or evidence are missing.'),
    `${tr('Project title')}\n${project.title}`,
    tr('Exercise: three 40-60-word posts and four FAQ answers for fictional Cedar Bakery. This describes the exercise, not proof that the files were created.'),
    `${tr('Practice objective and evidence')}\n${project.brief.objective.trim() || unknown}`,
    `${tr('Deliverables and exclusions')}\n${project.brief.scope.trim() || unknown}`,
    `${tr('Review role, missing evidence and next review date')}\n${project.brief.review.trim() || unknown}`,
    tr('Milestone record'),
    ...journey.stages.map((stage) => `${stage.complete ? '[x]' : '[ ]'} ${tr(stage.title)}`),
    `${tr('Proposal document:')} ${tr(journey.stages[2].complete ? 'Saved draft; review before sharing.' : 'Missing or needs regeneration.')}`,
    journey.summary
      ? `${tr('Recorded tests:')} ${journey.summary.total}; ${tr('Pass:')} ${journey.summary.pass}; ${tr('Fail:')} ${journey.summary.fail}; ${tr('Blocked:')} ${journey.summary.blocked}; ${tr('Not run or missing evidence:')} ${journey.summary.pending}`
      : tr('No saved test results.'),
    ...project.results?.tests.map((test, index) => [
      `${tr('Test')} ${index + 1}: ${test.name.trim() || unknown}`,
      `${tr('Recorded outcome:')} ${tr({
        pending: 'Not run or missing evidence', pass: 'Pass', fail: 'Fail', blocked: 'Blocked'
      }[effectiveTestStatus(test)])}`
    ].join('\n')) ?? [],
    `${tr('Recorded decision:')} ${decision ? tr({ continue: 'Continue', revise: 'Revise', stop: 'Stop' }[decision]) : tr('Not decided')}`,
    `${tr('Decision reasoning')}\n${project.results?.notes.rationale.trim() || unknown}`,
    `${tr('Remaining uncertainty')}\n${project.results?.notes.uncertainty.trim() || unknown}`,
    `${tr('Next actions')}\n${project.results?.notes.nextSteps.trim() || unknown}`,
    tr('Files stay in your own storage. Desofec does not inspect the posts, word counts, permissions or approval; saved outcomes are your statements, not independent verification.'),
    tr('This entry is private in your workspace. Downloading creates a device file, not a public page. No full proposal, structured financial fields or raw test evidence is included; user-entered titles and notes may still contain sensitive details. Review before sharing manually.'),
    tr('No client approval, publication permission, income promise or professional credential is granted by completing this journey.')
  ].join('\n\n');
}
