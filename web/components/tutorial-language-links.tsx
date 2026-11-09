import { TutorialLanguageNav } from '@/components/tutorial-language-nav';
import { tutorialLanguageVersions } from '@/lib/localized-tutorials';
import type { TutorialInfo } from '@/lib/tutorials';

export function TutorialLanguageLinks({ tutorial }: { tutorial: TutorialInfo }) {
  const versions = tutorialLanguageVersions(tutorial);
  if (versions.length === 0) return null;

  return <TutorialLanguageNav versions={versions} />;
}
