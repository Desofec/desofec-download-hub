import type { PilotProject } from '@/lib/pilot-projects';
import { serviceProjectJourney } from '@/lib/service-project-journeys';
import { projectJourneyHref } from '@/lib/first-content-project';
import { caseStudyFields } from '@/lib/case-study';

export function projectCompletion(project: PilotProject) {
  const journey = serviceProjectJourney(project);
  const query = `?project=${encodeURIComponent(project.id)}`;
  const workspace = `/business-launchpad/projects${query}`;
  const next = journey.next;
  const href = next ? projectJourneyHref(project, next.destination) : `/business-launchpad/case-study-builder${query}`;
  const caseStudy = project.caseStudy;
  const missingTests = caseStudy?.testIds.some((id) => !project.results?.tests.some((test) => test.id === id)) ?? false;
  return {
    stages: journey.stages,
    recorded: journey.stages.filter((stage) => stage.complete).length,
    total: journey.stages.length,
    ready: journey.ready,
    summary: journey.summary,
    decision: project.results?.decision ?? '',
    nextAction: next?.action ?? 'Review your saved case study and unresolved evidence before sharing manually.',
    nextLabel: next?.link ?? 'Build a freelance case study',
    nextHref: href.startsWith('#') ? workspace + href : href,
    workspace,
    caseStudyStatus: !caseStudy ? 'No saved case study.'
      : missingTests || caseStudyFields.some(({ key }) => !caseStudy.text[key].trim())
        ? 'Saved case study needs text or updated test references.'
        : 'Case study text saved; evidence and sharing still need review.'
  };
}
