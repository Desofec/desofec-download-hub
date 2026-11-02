import { aiAssistedCodingSteps } from '@/lib/ai-assisted-coding-tutorial';
import { aiBeginnerSteps, aiProductivitySteps } from '@/lib/ai-everyday-tutorials';
import { designBasicsSteps, mlFoundationsSteps } from '@/lib/ml-design-tutorials';
import { noCodeAutomationSteps, noCodeBuilderSteps, webStarterSteps } from '@/lib/web-nocode-tutorials';
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
  },
  {
    pathId: 'web-starter',
    href: '/tutorials/web-starter',
    title: 'Build and publish your first web page',
    intro: 'Learn how web pages work, design a simple layout, build it with HTML and publish it for free.',
    time: '60 minutes',
    steps: webStarterSteps
  },
  {
    pathId: 'no-code-builder',
    href: '/tutorials/no-code-builder',
    title: 'Build a small no-code tool',
    intro: 'Turn a real problem into a working tool with a database table and an automation, without writing code.',
    time: '60 minutes',
    steps: noCodeBuilderSteps
  },
  {
    pathId: 'no-code-automation',
    href: '/tutorials/no-code-automation',
    title: 'Automate your first task',
    intro: 'Understand workflows, connect your apps and build an automation that saves you time.',
    time: '45 minutes',
    steps: noCodeAutomationSteps
  },
  {
    pathId: 'ml-foundations',
    href: '/tutorials/ml-foundations',
    title: 'Train your first machine learning model',
    intro: 'Learn the core ideas of machine learning and train a small model in a free Google Colab notebook.',
    time: '45 minutes',
    steps: mlFoundationsSteps
  },
  {
    pathId: 'design-basics',
    href: '/tutorials/design-basics',
    title: 'Design a prototype: from sketch to CAD and AI',
    intro:
      'Learn design basics, turn an idea into a 3D prototype, try text-to-CAD tools and run a first simulation.',
    time: '75 minutes',
    steps: designBasicsSteps
  }
];

// The first tutorial predates the registry and keeps its original storage key.
export function tutorialStorageKey(pathId: string) {
  return pathId === 'first-app' ? 'desofec:tutorial:task-tracker' : `desofec:tutorial:${pathId}`;
}

export function getTutorialForPath(pathId: string) {
  return tutorials.find((tutorial) => tutorial.pathId === pathId);
}
