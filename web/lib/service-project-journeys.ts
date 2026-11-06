import {
  buildContentPortfolio, buildPracticePortfolio, contentJourney, contentJourneyStages,
  evaluateJourney, firstContentPath, type JourneyStage
} from '@/lib/first-content-project';
import type { PilotProject, ServicePathId } from '@/lib/pilot-projects';
import { effectiveTestStatus, emptyPilotTest, starterPilotTests, testHasEvidence, type PilotTest } from '@/lib/pilot-results';
import { automationProjects, type AutomationScenario } from '@/lib/automation-projects';

type Check = { code: string; label: string; input: string; expected: string };
type ServiceJourney = {
  title: string; heading: string; exercise: string; boundary: string;
  practiceTitle: string; learn: string; practise: string; draft: string; handover: string;
  proposalFields: readonly ('dataHandling' | 'timeline')[];
  checks: readonly Check[];
};

const automationChecks: Check[] = starterPilotTests((text) => text).map((test, index) => ({
  code: `AUTO-${index + 1}`, label: test.name, input: test.input, expected: test.expected
}));

export const serviceJourneys: Record<Exclude<ServicePathId, 'ai-content-services'>, ServiceJourney> = {
  'ai-video-business': {
    title: 'Your guided business video project',
    heading: 'PRACTICE PORTFOLIO - FICTIONAL BUSINESS VIDEOS, NOT PUBLICATION APPROVAL',
    exercise: 'Exercise: three 15-30-second 1080 x 1920 videos for fictional Cedar Bakery: visit, products and counter collection. Storyboards alone are not finished videos.',
    boundary: 'Private practice only: no posting, ads, cloned voices or guaranteed views and sales. Missing permissions or real owner approval stay blocked. Desofec does not inspect video files.',
    practiceTitle: '2. Create short-form videos with AI support',
    learn: 'Read lesson 1. Save the fictional facts, three video topics, 15-30-second duration, 1080 x 1920 format and unknown claims in the brief. Define the review owner and exclusions before checking brief and scope.',
    practise: 'Use lessons 2-4 and the kit. Keep three scripts, timed storyboards, caption text, asset permissions and versioned exports in your own storage. Record actual duration, resolution and phone checks; storyboard-only export checks stay blocked.',
    draft: 'Save a current proposal for three videos, scripts, captions and one revision round. Include exclusions, acceptance checks, review owner, timeline, data handling and handover. Unknown costs stay unknown; no automatic posting or sales promises.',
    handover: 'Keep the brief, scripts, captions, v1/v2 exports, permission ledger, version log and actual checks. Record missing owner approval as blocked. Check handover for a private practice package only, not permission to publish.',
    proposalFields: ['dataHandling', 'timeline'],
    checks: [
      { code: 'VIDEO-1', label: 'Video scripts and business facts',
        input: 'Compare all three scripts and exports with the fictional bakery brief.',
        expected: 'Tuesday-Saturday, 08:00-14:00, bread, pastries and counter collection only. No invented prices, delivery, allergens or results.' },
      { code: 'VIDEO-2', label: 'Three measured video exports',
        input: 'Reopen the visit, products and collection exports; measure each duration and resolution.',
        expected: 'All three are 15-30 seconds inclusive and 1080 x 1920. Storyboards or timeline settings alone cannot establish an export pass.' },
      { code: 'VIDEO-3', label: 'Captions and phone readability',
        input: 'Compare captions with narration, or check complete silent-video text. Watch all three on a phone with sound off.',
        expected: 'Correct text, readable messages and meaningful audio alternatives. Record actual observations and remaining gaps.' },
      { code: 'VIDEO-4', label: 'Video asset permissions and disclosure',
        input: 'Review source, permitted use and attribution for footage, music, fonts and generated illustrations.',
        expected: 'Permissions and applicable disclosure rules recorded. Unknown terms stay blocked; generated illustrations are not claimed as real business footage.' },
      { code: 'VIDEO-5', label: 'Video revisions and reopened files',
        input: 'Preserve v1, move hours earlier and improve captions in v2; reopen and recheck all three exports.',
        expected: 'Versions and changes traceable; facts and export checks repeated. The unknown price request remains pending and excluded.' },
      { code: 'VIDEO-6', label: 'Video service scope and costs',
        input: 'Review three-video scope, one revision round, actual time, vendor credits, unknown costs and data handling.',
        expected: 'Internal costs stay separate from the proposed fee. No confidential AI inputs, automatic posting or guaranteed views, sales or income.' },
      { code: 'VIDEO-7', label: 'Real owner approval before publication',
        input: 'Check whether an authorised real owner reviewed the actual package and granted required publication permission.',
        expected: 'Fictional practice has no real owner approval: blocked, never assumed passed. Continue means more practice or discovery.' }
    ]
  },
  'ai-automation-services': {
    title: 'Your guided automation-service project',
    heading: 'PRACTICE PORTFOLIO - FICTIONAL AUTOMATION PILOT, NOT A LIVE SERVICE',
    exercise: 'Exercise: a fictional enquiry review queue, six ordered events, failure/retry and a disabled-workflow runbook. No real inbox or automatic sending.',
    boundary: 'Practice only: no messages, pricing decisions or machine control. Continue means further discovery, not permission to enable a live workflow. Demand, savings and customer approval remain unvalidated unless evidenced.',
    practiceTitle: '2. Practise the review queue',
    learn: 'Read lessons 1-2. Record one fictional administrative task, the human reviewer and unvalidated demand in the objective. Set exclusions, access limits, spending cap and stop conditions before checking brief and scope.',
    practise: 'Use lesson 3 and the kit to process E1, repeated E1, E2, E3, E4 and E5 in order. Expect four queue rows, two drafts and zero messages sent. Preserve a safe failure/retry record and an off-switch/manual-fallback runbook in your own files.',
    draft: 'Reload the project proposal and optionally copy the brief. Define scope, exclusions, acceptance checks, review owner, handover and data handling including authorised access, retention, spending limits and the off switch. Generate, review and save; unknown fees stay blank.',
    handover: 'Keep the queue, seven scenario records, cost worksheet and versioned runbook with access revocation, error alerts, spending cap, safe retry and manual fallback. Record missing customer approval as blocked. Review the saved record and check handover; do not activate a live integration.',
    proposalFields: ['dataHandling'],
    checks: [
      ...automationChecks,
      {
        code: 'AUTO-8', label: 'Off switch and manual fallback',
        input: 'Disable the test workflow and rehearse the manual queue, error alert, access revocation and spending cap.',
        expected: 'No processing while disabled; the manual route and responsible reviewer are documented. Simulated controls are not proof of a real connector.'
      },
      {
        code: 'AUTO-9', label: 'Authorised customer review',
        input: 'Check whether an authorised customer actually reviewed the scope, tests and ongoing responsibilities.',
        expected: 'Record real evidence only; a fictional exercise with no customer approval stays blocked.'
      }
    ]
  },
  'ai-cad-services': {
    title: 'Your guided concept-only CAD project',
    heading: 'PRACTICE PORTFOLIO - CAD OR PAPER CONCEPT, NOT FOR MANUFACTURE',
    exercise: 'Exercise: an 80 x 40 x 3 mm display-card concept revised to 90 x 40 x 3 mm, with dimensioned views and a version log. State CAD or paper-only honestly.',
    boundary: 'CONCEPT ONLY - NOT FOR MANUFACTURE. Paper sketches are not CAD deliverables; a rendering is not measurement evidence. No structural, fit, safety or engineering approval is provided. Never fabricate or operate a part from this exercise.',
    practiceTitle: '2. Practise dimensions and revision',
    learn: 'Read the concept-only brief in lesson 1. Save units, dimensions and the CAD or paper-only method in the objective. Exclude functional engineering, manufacture and safety approval in scope and review before checking the brief and scope items.',
    practise: 'Use lessons 2-4 and the kit. Reconcile three views at 80 x 40 x 3 mm: volume 9600 cubic mm, ratio 2. Revise width to 90 mm: volume 10800, ratio 2.25. Preserve both versions, measurements, reopened exports and concept-only labels in your own files.',
    draft: 'Reload the project proposal and optionally copy the brief. Define concept deliverables, honest CAD or paper format, exclusions, dimensional checks, reviewer and handover. Exclude manufacture and engineering sign-off. Generate, review and save; unknown fees stay blank.',
    handover: 'Keep the brief, native CAD file or labelled paper sketch, three views, measurements, reopened exports and revision log. State software/version, units and licensing uncertainty. Label every page CONCEPT ONLY - NOT FOR MANUFACTURE. Record unavailable qualified review as blocked, then check handover.',
    proposalFields: [],
    checks: [
      {
        code: 'CAD-1', label: 'Base dimensions and three-view consistency',
        input: 'Measure or reconcile front, top and side for the 80 x 40 x 3 mm plain concept.',
        expected: 'All views agree in mm; volume 9600 cubic mm, front ratio 2. Paper scale 1:2 draws 40 x 20 mm but labels remain actual dimensions.'
      },
      {
        code: 'CAD-2', label: 'Controlled width revision',
        input: 'Preserve v1 and change only width to 90 mm in v2; recheck all views.',
        expected: 'v2 is 90 x 40 x 3 mm in every view; volume 10800 cubic mm, ratio 2.25; v1 remains available.'
      },
      {
        code: 'CAD-3', label: 'Reopened exports and concept labels',
        input: 'Reopen each exported view and inspect dimensions, units, version and concept-only label.',
        expected: 'Readable consistent exports labelled CONCEPT ONLY - NOT FOR MANUFACTURE; an image alone does not prove geometry.'
      },
      {
        code: 'CAD-4', label: 'Method and licensing boundaries',
        input: 'State CAD tool/version or paper-only method and inspect current licensing and sharing eligibility.',
        expected: 'Paper-only is not called CAD; commercial licensing and private sharing are not assumed. Missing permission evidence is blocked.'
      },
      {
        code: 'CAD-5', label: 'Required qualified or customer review',
        input: 'Check the review route and whether required customer or qualified professional review actually occurred.',
        expected: 'Unavailable required review stays blocked. No manufacturing, safety or engineering release is claimed.'
      }
    ]
  },
  'micro-saas-validation': {
    title: 'Your guided micro-SaaS validation project',
    heading: 'PRACTICE PORTFOLIO - LOCAL PROTOTYPE, NOT A SUBSCRIPTION PRODUCT',
    exercise: 'Exercise: a local-only two-line project-update formatter with a trimmed 1-40-character name and Draft or Review status. State browser or manual prototype honestly.',
    boundary: 'Local validation only: no network, storage, login, payments or subscriptions. Manual practice cannot prove browser checks. Continue means more discovery, not production readiness, validated demand or paying customers.',
    practiceTitle: '2. Practise the local formatter',
    learn: 'Read lessons 1-2. Save the recurring-task hypothesis, actual anonymised evidence or demand UNVALIDATED, and neutral discovery questions in the objective. Define the two-line output and exclude live hosting, payments, personal data and integrations before checking brief and scope.',
    practise: 'Use lessons 2-4 and the kit to reproduce the exact Atlas/Review output manually or in local formatter.html. Keep the trimmed 1-40-character name, Draft/Review status and textContent behavior. Record the method; manual-only work cannot pass browser-only checks.',
    draft: 'Reload the project proposal and optionally copy the brief. Scope discovery and a local prototype, not a live subscription. Define exclusions, checks, review owner, handover and data handling with no personal data, storage or payments. Generate, review and save; unknown future costs stay unknown.',
    handover: 'Keep the specification, versioned formatter or clearly labelled manual alternative, boundary-test evidence, anonymised observation notes and unknown-cost list. Record demand and payment interest as unvalidated without real evidence. Check handover only for a practice validation package, not a product launch.',
    proposalFields: ['dataHandling'],
    checks: [
      {
        code: 'SAAS-1', label: 'Exact two-line formatter output',
        input: 'Enter Atlas with status Review using the stated prototype method.',
        expected: 'Exactly Project: Atlas on line 1 and Status: Review on line 2. No extra output.'
      },
      {
        code: 'SAAS-2', label: 'Blank and whitespace-only rejection',
        input: 'In the browser prototype submit an empty name and then spaces only.',
        expected: 'Visible validation error for both; manual-only work records this browser check as blocked or not run.'
      },
      {
        code: 'SAAS-3', label: '40-character boundary',
        input: 'In the browser prototype submit a name with exactly 40 characters after trimming.',
        expected: 'Accepted with exact two-line output; count the characters. Manual-only work cannot establish a browser pass.'
      },
      {
        code: 'SAAS-4', label: 'Forced 41-character rejection',
        input: 'Use browser developer tools to set a 41-character input value, bypassing maxlength, then submit.',
        expected: 'Visible error; the JavaScript guard rejects more than 40 characters. Manual-only work cannot establish a browser pass.'
      },
      {
        code: 'SAAS-5', label: 'Literal markup and local-only behavior',
        input: 'Enter <b>Atlas</b>; inspect output and check the toy for network calls or saved data.',
        expected: 'Markup remains literal text, no bold element; no network or storage. Manual-only work cannot establish a browser pass.'
      },
      {
        code: 'SAAS-6', label: 'Invalid status rejection',
        input: 'In browser developer tools insert and select an unsupported status, then submit.',
        expected: 'Visible error for status other than Draft or Review; no formatted update.'
      },
      {
        code: 'SAAS-7', label: 'Observed usefulness and demand uncertainty',
        input: 'Optionally observe a consenting adult using fictional data and record only anonymised actual feedback.',
        expected: 'Separate behavior, opinions, recurring need and commitment. Without a tester, record blocked and demand unvalidated; never invent subscribers.'
      },
      {
        code: 'SAAS-8', label: 'Future costs and launch gaps',
        input: 'Review time spent, future hosting/API/support costs and missing production responsibilities.',
        expected: 'Unknown costs stay unknown; list authentication, permissions, deletion, billing, refunds, support and recovery as separate future work.'
      }
    ]
  },
  'ai-education-services': {
    title: 'Your guided adult-workshop project',
    heading: 'PRACTICE PORTFOLIO - ADULT WORKSHOP MATERIALS, NOT A QUALIFICATION',
    exercise: 'Exercise: a 15-minute adult workshop checking fictional claims against a 10:00 start, 30-minute duration and 12-seat fact sheet, with a manual four-point practice rubric.',
    boundary: 'Adult practice only: no children, learner profiles, recordings, automated grading or accreditation. Rehearsal is not a learner trial; a practice score is not a qualification or evidence of lasting learning.',
    practiceTitle: '2. Practise accessible workshop materials',
    learn: 'Read lesson 1. Save the adult audience and observable claim-checking objective in the brief. Exclude certification, learner profiling, real records and automated grading. Record the review role and missing evidence before checking brief and scope.',
    practise: 'Use lessons 2-4 and the kit. Create original materials and a readable text alternative. Plan 3+5+4+3 minutes. Check 10:00 supported, 60 minutes contradicted by 30, and certificates unknown; build the manual four-point rubric. Rehearse without collecting learner identities.',
    draft: 'Reload the project proposal and optionally copy the brief. Scope one 15-minute adult workshop, original handout, checked key and one revision. Define exclusions, checks, review owner, timeline, accessible handover and data handling with no learner records. Generate, review and save.',
    handover: 'Keep the brief, 15-minute plan, fact sheet, original handout, checked key, accessible alternatives and version log. Record material-level feedback only. Distinguish rehearsal, optional adult trial and independent review; missing trial or review stays blocked. Review the saved record and check handover.',
    proposalFields: ['dataHandling', 'timeline'],
    checks: [
      {
        code: 'EDU-1', label: 'Fact sheet and four-point answer key',
        input: 'Check the handout and manual rubric against start 10:00, duration 30 minutes and 12 seats.',
        expected: '10:00 supported; 60 minutes contradicted by 30; certificate unknown; ask organiser for verified policy. Four distinct points, no qualification claim.'
      },
      {
        code: 'EDU-2', label: '15-minute rehearsal timing',
        input: 'Rehearse the 3+5+4+3-minute activities and record actual duration, not just planned timing.',
        expected: 'Plan totals 15 minutes; record overruns and revisions honestly. Rehearsal does not imply a learner trial occurred.'
      },
      {
        code: 'EDU-3', label: 'Accessible alternatives and original materials',
        input: 'Check readable text, plain language, non-colour cues, keyboard access where relevant and an alternative to speaking aloud.',
        expected: 'Document actual checks and corrections; provide an original text alternative with authorised sources, not copied paid course material.'
      },
      {
        code: 'EDU-4', label: 'Optional consenting-adult trial',
        input: 'If available, invite a consenting adult and record only non-identifying observations about materials.',
        expected: 'No names, scores, recordings or profiles retained. No tester means blocked or not run, never an invented successful trial.'
      },
      {
        code: 'EDU-5', label: 'Independent material review',
        input: 'Check whether a second adult reviewer compared the materials and rubric with the supplied source.',
        expected: 'Record actual material-level evidence; unavailable independent review stays blocked. No broader learning or employment claim.'
      }
    ]
  }
};

export function serviceJourneyDefinition(pathId: ServicePathId, scenario?: AutomationScenario): ServiceJourney | null {
  if (pathId === 'ai-automation-services' && scenario && scenario !== 'enquiries') {
    return { ...serviceJourneys[pathId], ...automationProjects[scenario] };
  }
  return pathId === firstContentPath ? null : serviceJourneys[pathId];
}

export function serviceJourneyTests(pathId: ServicePathId, tr: (text: string) => string, scenario?: AutomationScenario): PilotTest[] {
  const definition = serviceJourneyDefinition(pathId, scenario);
  if (!definition) throw new Error('Use the content-service checks described in your guided journey.');
  return definition.checks.map((check, index) => ({
    ...emptyPilotTest(`test-${index + 1}`),
    name: `[${check.code}] ${tr(check.label)}`, input: tr(check.input), expected: tr(check.expected)
  }));
}

export function serviceJourneyCoverage(project: PilotProject) {
  const definition = serviceJourneyDefinition(project.pathId, project.automationScenario);
  return definition?.checks.map((check) => {
    const matches = project.results?.tests.filter((test) => test.name.trim().startsWith(`[${check.code}]`)) ?? [];
    // Ambiguous duplicates cannot substitute for a missing required case.
    const recorded = matches.length === 1 && testHasEvidence(matches[0]) && effectiveTestStatus(matches[0]) !== 'pending';
    return { ...check, recorded };
  }) ?? [];
}

export function serviceProjectJourney(project: PilotProject) {
  const definition = serviceJourneyDefinition(project.pathId, project.automationScenario);
  if (!definition) return contentJourney(project);
  const stages: JourneyStage[] = contentJourneyStages.map((stage) => {
    switch (stage.id) {
      case 'learn': return { ...stage, instruction: definition.learn, link: 'Preview the lessons' };
      case 'practise': return { ...stage, title: definition.practiceTitle, instruction: definition.practise, link: 'Open the service kit' };
      case 'draft': return { ...stage, instruction: definition.draft, action: 'Save a current proposal with service-specific scope, checks and review boundaries.' };
      case 'test': return {
        ...stage, instruction: 'Reload the project results draft, then explicitly load the required service test plans or add their bracketed codes to matching existing cases. Record input, expected and actual evidence plus an honest outcome for every required code. Save results and check the evidence item.',
        action: 'Record each required service check with evidence; unavailable approval or trials stay blocked.'
      };
      case 'handover': return { ...stage, instruction: definition.handover };
      default: return stage;
    }
  });
  const coverage = serviceJourneyCoverage(project);
  return {
    ...evaluateJourney(project, stages, coverage.every((check) => check.recorded), definition.proposalFields),
    recordedChecks: coverage.filter((check) => check.recorded).length
  };
}

export function buildServicePortfolio(project: PilotProject, tr: (text: string) => string) {
  const definition = serviceJourneyDefinition(project.pathId, project.automationScenario);
  if (!definition) return buildContentPortfolio(project, tr);
  const journey = serviceProjectJourney(project);
  return [
    buildPracticePortfolio(project, tr, journey, definition),
    tr('Required service checks - recorded evidence is not a passing grade or independent verification.'),
    ...serviceJourneyCoverage(project).map((check) =>
      `${check.recorded ? '[x]' : '[ ]'} [${check.code}] ${tr(check.label)}`),
    tr('Files stay in your own storage. Desofec does not inspect deliverables or independently verify measurements, runtime behavior, permissions, trials or approval.')
  ].join('\n\n');
}
