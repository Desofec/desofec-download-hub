import { notFound } from 'next/navigation';
import AiAssistedCodingTutorialPage from '@/app/projects/ai-assisted-coding/build/page';
import CodingFoundationsTutorialPage from '@/app/projects/coding-foundations/build/page';
import TaskTrackerTutorialPage from '@/app/projects/first-app/build/page';
import { TutorialRouteLanguage } from '@/components/language';
import { localizedTutorialMetadata, localizedTutorials, type LocalizedTutorialLanguage } from '@/lib/localized-tutorials';

const legacyProjects = new Set(['ai-assisted-coding', 'coding-foundations', 'first-app']);
export type LegacyTutorialParams = { params: Promise<{ project: string }> };

export function legacyTutorialParams() {
  return localizedTutorials
    .filter((tutorial) => tutorial.href.startsWith('/projects/'))
    .map((tutorial) => ({ project: tutorial.href.split('/')[2] }));
}

export async function legacyTutorialMetadata(language: LocalizedTutorialLanguage, { params }: LegacyTutorialParams) {
  const { project } = await params;
  const tutorial = localizedTutorials.find((entry) => entry.href === `/projects/${project}/build`);
  if (!tutorial || !legacyProjects.has(project)) notFound();
  return localizedTutorialMetadata(tutorial, language);
}

function LegacyTutorial({ project }: { project: string }) {
  switch (project) {
    case 'ai-assisted-coding': return <AiAssistedCodingTutorialPage />;
    case 'coding-foundations': return <CodingFoundationsTutorialPage />;
    case 'first-app': return <TaskTrackerTutorialPage />;
    default: notFound();
  }
}

export async function LocalizedLegacyTutorial({
  language,
  params
}: LegacyTutorialParams & { language: LocalizedTutorialLanguage }) {
  const { project } = await params;
  const tutorial = localizedTutorials.find((entry) => entry.href === `/projects/${project}/build`);
  if (!tutorial || !legacyProjects.has(project)) notFound();

  return (
    <TutorialRouteLanguage language={language}>
      <LegacyTutorial project={project} />
    </TutorialRouteLanguage>
  );
}
