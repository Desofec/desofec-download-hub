'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTr } from '@/components/tr';
import type { LearningPath } from '@/lib/types';
import { firstContentPath } from '@/lib/first-content-project';
import type { ServicePathId } from '@/lib/pilot-projects';

const choices: { id: ServicePathId; label: string }[] = [
  { id: 'ai-content-services', label: 'Create a writing/content service package (Recommended)' },
  { id: 'ai-automation-services', label: 'Explore an administrative automation service' },
  { id: 'ai-cad-services', label: 'Prepare a concept-only CAD service' },
  { id: 'micro-saas-validation', label: 'Validate a small software idea' },
  { id: 'ai-education-services', label: 'Prepare an adult workshop service' }
];

export function FirstProjectChooser({ paths }: { paths: LearningPath[] }) {
  const tr = useTr();
  const [selected, setSelected] = useState<ServicePathId>('ai-content-services');
  const path = paths.find((path) => path.id === selected);
  const guided = selected === firstContentPath;
  return (
    <div className="proposal-builder first-project-chooser">
      <fieldset>
        <legend>{tr('What would you like to practise?')}</legend>
        {choices.filter((choice) => paths.some((path) => path.id === choice.id)).map((choice) => (
          <label className="project-check" key={choice.id}>
            <input type="radio" name="first-project-goal" value={choice.id} checked={selected === choice.id}
              onChange={() => setSelected(choice.id)} />
            <span>{tr(choice.label)}</span>
          </label>
        ))}
      </fieldset>
      {path && <section className="path-card" aria-labelledby="first-project-recommendation" aria-live="polite">
        <h2 id="first-project-recommendation">{tr(path.title)}</h2>
        <p>{tr(path.description)}</p>
        <p>{tr(guided
          ? 'Recommended first journey: no coding or paid AI required. Six guided milestones lead to a private practice-portfolio preview.'
          : 'This path has lessons, a kit and a project workspace. The six-milestone guided portfolio journey currently supports AI Content Services only.')}</p>
        <p>{tr('Your choice does not create, save or upload a project. Next, choose a project title and explicitly create it on your device.')}</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href={`/business-launchpad/projects?path=${encodeURIComponent(selected)}`}>
            {tr(guided ? 'Start the guided content project' : 'Start a practice project')}
          </Link>
          <Link className="btn btn-secondary" href={`/tutorials/${selected}`}>{tr('Preview the lessons')}</Link>
        </div>
      </section>}
    </div>
  );
}
