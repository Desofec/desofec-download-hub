import { aiAssistedCodingSteps } from '@/lib/ai-assisted-coding-tutorial';
import { aiBeginnerSteps, aiProductivitySteps } from '@/lib/ai-everyday-tutorials';
import { codingFoundationsSteps } from '@/lib/coding-foundations-tutorial';
import { taskTrackerSteps, type TutorialStep } from '@/lib/task-tracker-tutorial';

export type TutorialInfo = {
  pathId: string;
  href: string;
  title: string;
  intro: string;
  time: string;
  steps: TutorialStep[];
};

// Older tutorials keep their original URLs. New ones live under /tutorials/<pathId>.
export const tutorials: TutorialInfo[] = [
  {
    pathId: 'first-app',
    href: '/projects/first-app/build',
    title: 'Code your own task tracker',
    intro: '',
    time: '60 minutes',
    steps: taskTrackerSteps
  },
  {
    pathId: 'coding-foundations',
    href: '/projects/coding-foundations/build',
    title: 'Learn to code with Python',
    intro: '',
    time: '90 minutes',
    steps: codingFoundationsSteps
  },
  {
    pathId: 'ai-assisted-coding',
    href: '/projects/ai-assisted-coding/build',
    title: 'Code with an AI assistant',
    intro: '',
    time: '60 minutes',
    steps: aiAssistedCodingSteps
  },
  {
    pathId: 'ai-beginner',
    href: '/tutorials/ai-beginner',
    title: 'Your first steps with AI',
    intro:
      'Learn what AI assistants are, how to talk to them well and how to turn a good prompt into a routine. You only need a free account with any AI assistant.',
    time: '30 minutes',
    steps: aiBeginnerSteps
  },
  {
    pathId: 'ai-productivity',
    href: '/tutorials/ai-productivity',
    title: 'Build your AI productivity system',
    intro:
      'Find the tasks AI can help with, build a small set of reusable prompts, turn them into weekly routines and measure what really works.',
    time: '45 minutes',
    steps: aiProductivitySteps
  }
];

export function getTutorialForPath(pathId: string) {
  return tutorials.find((tutorial) => tutorial.pathId === pathId);
}
