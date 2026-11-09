import { notFound } from 'next/navigation';
import TutorialPage from '@/app/tutorials/[id]/page';
import { TutorialRouteLanguage } from '@/components/language';
import { localizedTutorialMetadata, localizedTutorials, type LocalizedTutorialLanguage } from '@/lib/localized-tutorials';

export type HostedTutorialParams = { params: Promise<{ id: string }> };

export function hostedTutorialParams() {
  return localizedTutorials
    .filter((tutorial) => tutorial.href.startsWith('/tutorials/'))
    .map((tutorial) => ({ id: tutorial.pathId }));
}

export async function hostedTutorialMetadata(language: LocalizedTutorialLanguage, { params }: HostedTutorialParams) {
  const { id } = await params;
  const tutorial = localizedTutorials.find((entry) => entry.href === `/tutorials/${id}`);
  if (!tutorial) notFound();
  return localizedTutorialMetadata(tutorial, language);
}

export async function LocalizedHostedTutorial({
  language,
  params
}: HostedTutorialParams & { language: LocalizedTutorialLanguage }) {
  const { id } = await params;
  const tutorial = localizedTutorials.find((entry) => entry.href === `/tutorials/${id}`);
  if (!tutorial) notFound();

  return (
    <TutorialRouteLanguage language={language}>
      <TutorialPage params={Promise.resolve({ id })} />
    </TutorialRouteLanguage>
  );
}
